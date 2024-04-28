const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


//uri
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.jnc3ejx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

//creating mongoClient
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const touristSpotsCollection = client.db("asiaVoyageDB").collection("touristspots");


async function run() {
    try {
        await client.connect();


        app.get("/touristSpots" , async(req , res) => {
            res.send('connected')
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


app.get("/", async (req, res) => {
    res.send("Server is connected...")
});

app.listen(port, () => {
    console.log("app is listening on port : ", port);
})