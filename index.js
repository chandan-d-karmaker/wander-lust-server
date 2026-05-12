const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()
const uri = process.env.MONGODB_URI;

const PORT = process.env.PORT;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("wanderlust");
    const destinationCollection = db.collection("destination");

    app.post("/destination", async(req, res)=>{
      const destinationData = req.body;
      console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);
      res.json(result);
    })

    app.get('/destination', async(req, res)=>{
      const result = await destinationCollection.find().toArray();
      res.send(result);
    })

    app.get('/destination/:id', async(req, res)=>{
      const id = req.params.id;

      const result = await destinationCollection.findOne({_id: new ObjectId(id)});
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("server is working.........")
})

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})