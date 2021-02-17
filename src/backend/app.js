const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const objectid = require("objectid");

const CONNECTION_URL =
  "mongodb+srv://mireeantar:0sPzdXp7sm6mre1y@cluster0.fmjkv.mongodb.net/blogspot?retryWrites=true&w=majority";
const DATABASE_NAME = "blogspot";

const app = Express();
const GridFsStorage = require('multer-gridfs-storage');
const multer = require("multer")
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
app.use(BodyParser.json());
//what is extened false and extend true?
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
let database, collection;
const crypto = require("crypto")
// Create storage engine



const conn = mongoose.createConnection(CONNECTION_URL)
let gfs;
conn.once('open', () => {
    //initialize our stream
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('blog_pics')
    console.log("we're in")
})

const storage = new GridFsStorage({
  url: CONNECTION_URL,
  file: (req, file) => {
      return new Promise(
          (resolve, reject) => {
            console.log(file)
            console.log(req.body)
            console.log(file.name)
                     const fileInfo = {
                  filename: "10-pic",
                  bucketName: "blog_pics"
              }
              resolve(fileInfo)

          }
      )
  }
})

const upload = multer({ storage });

// const storage = new GridFsStorage({
//   url: CONNECTION_URL,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           console.log("we got issues")
//           return reject(err);
//         }
//         const filename = file.originalname;
//         const fileInfo = { filename: filename, bucketName: "blog_pics" };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

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


app.get("/getPic", (req, res) => {
  gfs.files.findOne({ filename: "10-pic" }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: "No file exists" });
    }
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: "Not an image" });
    }
  });
});


// app.post("/uploadPic", upload.single("blogImg"), (req, res, err) => {
//   console.log(req.body)
//   if (err){
//     console.log("its here")
//     throw err;
//   } 
//   res.status(201).send();
// });

app.post("/uploadPic",upload.single("blogImg"),(req,res)=>{
  res.json({file:req.file})
  })



app.post("/getPostComment", (request, response) => {
  const postId = request.body.postId;
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    const resres = result[0].blogPosts.filter(
      (post) => post.postId === +postId
    );
    response.json(resres[0].comments);
  });
});

//route handler to send data
app.post("/sendBlogPosts", (req, res) => {
  // when user enters info it will be stored in the body
  //req.data sends the stored infomation to express server

  const data = req.body;
  const body = {
    title: data.title,
    contents: data.contents,
    date: data.date,
    postId: data.postId,
    author: data.author,
    comments: [],
  };
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
        { $push: { "blogPosts.$.comments": commentData } }, //pointing to array comments, and adding data
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

app.put("/updatePosts", (request, response) => {
  let classCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("post_data");
      console.log(request.body);
      classCollection.updateOne(
        //determine the condition on which object to modify
        { "blogPosts.postId": +request.body.postId },
        {
          $set: {
            "blogPosts.$.contents": request.body.newContents.content,
            "blogPosts.$.title": request.body.newContents.title,
          },
        },
        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("update the posts!");
        }
      );
    }
  );
});

app.delete("/removePosts", (request, response) => {
  let classCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("post_data");
      console.log(request.body);
      classCollection.update(
        //determine the condition on which object to modify
        { "blogPosts.postId": +request.body.postId },
        { $pull: { blogPosts: { postId: +request.body.postId } } },

        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("deleted the posts!");
        }
      );
    }
  );
});

app.delete("/removeComments", (request, response) => {
  let classCollection;
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      classCollection = database.collection("post_data");
      console.log(request.body);
      classCollection.update(
        //determine the condition on which object to modify
        { "blogPosts.postId": +request.body.postId },
        {
          $pull: {
            "blogPosts.$.comments": { commentId: +request.body.commentId },
          },
        },

        (err, obj) => {
          if (err) {
            return response.status(500).send(error);
          }
          response.send("deleted the posts!");
        }
      );
    }
  );
});
