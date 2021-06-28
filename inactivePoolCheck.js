/*
    Inactive Pool Check runs every 5 minutes to check for ETH deposit pools that have been open for longer than 1hr.
*/
exports = async function () {

    const pools_staging = await context.services.get("BitSwap").db("staging").collection("pools");
    const pools_prod = await context.services.get("BitSwap").db("production").collection("pools");
    const txns_staging = await context.services.get("BitSwap").db("staging").collection("transactions");
    const txns_prod = await context.services.get("BitSwap").db("production").collection("transactions");

    const dateNow = new Date();
    const timeLimit = 3600000;

    //find all pools that have been active for longer than the time limit (1hr)
    //so activeStart of the pool started before the current time - 1 hour
    await pools_staging.updateMany(
        { active: true, activeStart: { $lt: dateNow.getTime() - timeLimit } },
        { $set: { active: false, activeStart: null, user: null } }
    );
    await pools_prod.updateMany(
        { active: true, activeStart: { $lt: dateNow.getTime() - timeLimit } },
        { $set: { active: false, activeStart: null, user: null } }
    );
    await txns_staging.updateMany(
        { completed: false, transactionType: "deposit", assetType: "ETH", created: { $lt: new Date(dateNow.getTime() - timeLimit) } },
        { $set: { completed: true, completionDate: new Date(), state: "failed", error: "Deposit Timed Out" } }
    );
    await txns_prod.updateMany(
        { completed: false, transactionType: "deposit", assetType: "ETH", created: { $lt: new Date(dateNow.getTime() - timeLimit) } },
        { $set: { completed: true, completionDate: new Date(), state: "failed", error: "Deposit Timed Out" } }
    );

    return;

};
