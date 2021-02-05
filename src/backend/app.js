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

app.post("/getPostComment", (request, response) => {
  const postId = request.body.postId;
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    const resres = result[0].blogPosts.filter((post) => post.id === +postId);
    console.log(resres);
    response.json(resres[0].comments);
  });
});

//route handler to send data
app.post("/sendBlogPosts", (req, res) => {
  // when user enters info it will be stored in the body
  //req.data sends the stored infomation to express server
  console.log("i am here");
  const data = req.body;
  const body = {
    title: data.title,
    contents: data.contents,
    date: data.date,
    id: data.id,
    author: data.author,
  };
  console.log(body);
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
      //$push: append  the body to the collection and is what is being updated by .updateOne
      //{}: is the document
      collection.updateOne({}, { $push: { blogPosts: body } }, (error, obj) => {
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
        date: "",
        author: "",
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

app.post("/addComments", (request, response) => {
  const body = {
    commentData: { author: "", comment: "", date: "" },
    postId: "",
  };
  const commentData = request.body.commentData; // second step, use $push to push commentData into commentsArray
  let postCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME); // pointing to database
      postCollection = database.collection("post_data"); // point to collection
      postCollection.updateOne(
        //push/update data into the collection
        { "blogPosts.postId": request.body.postID }, //point to target object to push/udate data
        { $push: { "blogPosts.$.comments": commentData } }, //pointing to array students, and adding data
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("added comment!");
        }
      );
    }
  );
});
