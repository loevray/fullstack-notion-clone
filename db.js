const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";

const client = new MongoClient(URI);

const makeNewUser = async () => {
  try {
    const database = client.db("test");
    const userCollection = database.collection("user");

    const newUser = { name: "karina", position: "main vocal" };
    const result = await userCollection.insertOne(newUser);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } catch (e) {
    console.error(`error with that reason:${e}`);
  }
};

const findUser = async () => {
  try {
    const userCollection = client.db("test").collection("user");
    const findResult = userCollection.find({ name: "karina" });

    for await (const doc of findResult) {
      console.log(`find karina! : ${JSON.stringify(doc)}`);
    }
  } catch (e) {
    console.error(`error with that reason:${e}`);
  }
};

async function run() {
  await makeNewUser();

  await findUser();

  client.close();
}

run().catch(console.dir);
