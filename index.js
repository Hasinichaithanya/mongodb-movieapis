const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://hasinichaithanya04:70wYPVBwal3dRRTK@cluster0.suc7fzf.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
let db;
app.use(express.json());
app.use(cors());
const client = new MongoClient(uri);
client
  .connect()
  .then((res) => {
    console.log("Connected to db");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });

    db = client.db("sample_mflix");
    const movies = db.collection("movies");

    //get all movies api
    app.get("/get-all", async (req, res) => {
      movies
        .find({})
        .toArray()
        .then((moviesList) =>
          res.json({ message: "Data is successfully fetched", moviesList })
        )
        .catch((e) => {
          res.send("Error fetching the data:", e.message);
          console.log(err);
        });
    });

    //add movie api
    app.post("/add-movie", (req, res) => {
      const movie = req.body;
      movies
        .insertOne(movie)
        .then((movie) =>
          res.json({
            message: "Movie is added successfully",
            movie,
            success: true,
          })
        )
        .catch((e) => {
          res.json("Error: ", e);
          console.log(err);
        });
    });

    //get movie based on id
    app.get("/get-single", async (req, res) => {
      const { id } = req.query;
      if (!mongodb.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid movie ID" });
      }
      movies
        .findOne({ _id: new mongodb.ObjectId(id) })
        .then((movie) =>
          res.json({
            message: "Movie is fetched successfully",
            movie,
          })
        )
        .catch((e) => {
          res.send("Error: ", e);
          console.log(err);
        });
    });

    //get movies based on query params
    app.get("/get-paginated", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      if (page <= 0) {
        return res.status(400).json({
          message: "Invalid page size, page size must be greater than 0",
          success: false,
        });
      }
      movies
        .find({})
        .skip((page - 1) * size)
        .limit(size)
        .toArray()
        .then((result) => {
          res.json({ message: "Fetched successfully", result });
        })
        .catch((e) => {
          res.json("Error: ", e.message);
        });
    });

    //delete movie based on id
    app.delete("/delete-movie", async (req, res) => {
      const id = req.query.id;
      if (!mongodb.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid movie ID" });
      }
      movies
        .deleteOne({ _id: new mongodb.ObjectId(id) })
        .then((response) => {
          res.json({
            success: true,
            message: "Movie is deleted successfully",
            response,
          });
        })
        .catch((e) => {
          res.send("Error: ", e);
          console.log(e);
        });
    });
  })
  .catch((err) => {
    res.json(err.message);
    console.log("Error connecting", err.message);
  });
