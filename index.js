const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


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
const allUsersTouristSpots = client.db("asiaVoyageDB").collection("allUsersTouristSpots");


async function run() {
    try {
        await client.connect();


        //get all pre defined tourist spots for homepage
        app.get("/touristSpots", async (req, res) => {
            const result = await touristSpotsCollection.find().toArray();
            res.send(result)
        })

        //get single pre defined tourist spots for homepage
        app.get("/touristSpots/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await touristSpotsCollection.findOne(query);
            res.send(result)
        })

        //create tourist spot details
        app.post("/addTouristSpot", async (req, res) => {
            const touristSpotDetails = req.body;
            const result = await allUsersTouristSpots.insertOne(touristSpotDetails);
            res.send(result);
        })

        //get all user created tourist spots
        app.get("/allTouristSpot", async (req, res) => {
            const result = await allUsersTouristSpots.find().toArray();
            res.send(result);
        })

        //get single tourist spot
        app.get("/allTouristSpot/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allUsersTouristSpots.findOne(query);
            res.send(result);
        })


        //get single user added data 
        app.get("/myList/:email", async (req, res) => {
            const email = { userEmail: req.params.email };
            const result = await allUsersTouristSpots.find(email).toArray();
            res.send(result);
        })


        //update a single tourist spot
        app.put("/myList/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedSpotDetails = req.body;

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: updatedSpotDetails.userName,
                    userEmail: updatedSpotDetails.userEmail,
                    touristSpotName: updatedSpotDetails.touristSpotName,
                    countryName: updatedSpotDetails.countryName,
                    location: updatedSpotDetails.location,
                    photoUrl: updatedSpotDetails.photoUrl,
                    averageCost: updatedSpotDetails.averageCost,
                    seasonality: updatedSpotDetails.seasonality,
                    travelTime: updatedSpotDetails.travelTime,
                    visitorPerYear: updatedSpotDetails.visitorPerYear,
                    shortDescription: updatedSpotDetails.shortDescription,
                },
            };

            const result = await allUsersTouristSpots.updateOne(filter , updateDoc , options);
            res.send(result);
        })


        //delete spot from my list
        app.delete("/delete/:id" , async(req , res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await allUsersTouristSpots.deleteOne(query);
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


app.get("/", async (req, res) => {
    res.send("Server is connected...")
});

app.listen(port, () => {
    console.log("app is listening on port : ", port);
})