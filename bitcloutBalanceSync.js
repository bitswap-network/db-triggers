exports = async function () {
    const users_staging = await context.services.get("BitSwap").db("staging").collection("users");
    const users_prod = await context.services.get("BitSwap").db("production").collection("users");

    const users = await users_prod.find({}).toArray();

    for (let i = 0; i < users.length; i++) {
        console.log(JSON.stringify(users[i].bitclout.username))
        const response = await users_staging.updateOne({ "bitclout.publicKey": users[i].bitclout.publicKey }, { $set: { "balance.bitclout": users[i].balance.bitclout } })
        console.log(JSON.stringify(response))
    }
    return;
};
