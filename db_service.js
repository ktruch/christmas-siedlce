const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();

const uri = "mongodb+srv://katarzynatruch:zDcgC7IVwo6QonUO@christmascluster.vk7zb.mongodb.net/?retryWrites=true&w=majority&appName=ChristmasCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors());

app.get('/names', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("christmas_draw");
    const collection = database.collection("userData");
    const names = await collection.find({ draw: null }, { projection: { id: 1, name: 1, draw: 1, _id: 0} }).toArray();
    res.json(names);
  } finally {
    await client.close();
  }
});

app.get('people_left', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("christmas_draw");
    const collection = database.collection("userData");
    const names = await collection.find({ draw: { $exists: false } }, { projection: {id: 1, name: 1, draw: 1, _id: 0 } }).toArray();
    res.json(names);
  } finally {
    await client.close();
  }
});

app.post('/draw', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("christmas_draw");
    const collection = database.collection("userData");

    const { id, drawnId } = req.body;
    const updatedNames = await collection.updateOne({ id: id }, { $set: { draw: drawnId } });

    res.json(updatedNames);
  } finally {
    await client.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});