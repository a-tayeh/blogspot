const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");

const CONNECTION_URL =
  "mongodb+srv://mireeantar:0sPzdXp7sm6mre1y@cluster0.fmjkv.mongodb.net/blogspot?retryWrites=true&w=majority";
const DATABASE_NAME = "blogspot";

var app = Express();

app.use(BodyParser.json());
//what is extened false and extend true?
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
var database, collection;

app.listen(3014, () => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("post_data");
      console.log("Connected to `" + DATABASE_NAME + "`!");
    }
  );
});

app.get("/getBlogPosts", (request, response) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.json(result);
  });
});

//route handler to send data
app.post("/sendBlogPosts", (req, res) => {
  // when user enters info it will be stored in the body
  //req.data sends the stored infomation to express server
  const data = req.body;
  const body = { title: data.title, contents: "the contents", id: -4 };
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("post_data");
      //Updates a single document within the collection based on the filter.
      //$push: append to  the body and is what is being updated by .updateOne
      //{}: is the document
      collection.updateOne({}, { $push: { data: body } }, (error, obj) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.send("it worked");
      });
    }
  );
});

app.post("/createNewPost", (request, response) => {
  const body = {
    postName: request.body.postName,
    blogPosts: [
      {
        title: "",
        contents: "",
      },
    ],
  };
  let blogCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      blogCollection = database.collection("post_data");
      blogCollection.updateOne(
        {},
        { $push: { blogPosts: body } },
        (error, obj) => {
          if (error) {
            return response.status(500).send(error);
          }
          response.send("created new post!");
        }
      );
    }
  );
});
