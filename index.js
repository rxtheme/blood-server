const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI || `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@bloodapi.u5bta.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`;


const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      await client.connect();
      console.log("MongoDB is connected");

      const database = client.db("UsersDB");
      const userCollection = database.collection("user");

      app.get("/", (req, res) => {
         res.send("Server is running...");
      });

      app.get("/users", async (req, res) => {
         try {
            const users = await userCollection.find({}).toArray();
            res.send(users);
         } catch (error) {
            console.error("Error fetching users:", error);
            res
               .status(500)
               .send({ error: "An error occurred while fetching users." });
         }
      });

      // get single data

      app.get("/users/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await userCollection.findOne(query);
         res.send(result);
      });

      app.post("/users", async (req, res) => {
         try {
            const newUser = req.body;
            console.log("New student application:", newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
         } catch (error) {
            console.error("Error inserting user:", error);
            res
               .status(500)
               .send({ error: "An error occurred while processing the user." });
         }
      });



      app.listen(port, () => {
         console.log(`Server is running at http://localhost:${port}`);
      });

   } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1); // Exit process with failure
   }
}

run().catch(console.error);