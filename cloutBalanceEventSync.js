exports = async function (changeEvent) {
    console.log(JSON.stringify(changeEvent))
    const fullDocument = changeEvent.fullDocument;
    if (fullDocument) {
        const users_prod = await context.services.get("BitSwap").db("production").collection("users");
        const user_prod = await users_prod.findOne({ _id: fullDocument._id });
        if (user_prod.balance.bitclout !== fullDocument.balance.bitclout) {
            const response = await users_prod.updateOne({ "bitclout.publicKey": fullDocument.bitclout.publicKey }, { $set: { "balance.bitclout": fullDocument.balance.bitclout } })
            console.log(JSON.stringify(response))
        }
    }
    return
};
