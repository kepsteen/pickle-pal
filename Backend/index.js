import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";

const app = express();
const port = 3000;

const mongo = new MongoClient(process.env.DB_URL);
await mongo.connect();
const databasesList = await mongo.db().admin().listDatabases();

console.log("Databases:", databasesList);
app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
