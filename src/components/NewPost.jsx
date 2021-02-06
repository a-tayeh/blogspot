import React from "react";
import firebase from "../firebase";
import { useHistory } from "react-router-dom";

export const NewPost = () => {
  const [postData, setPostData] = React.useState([]);
  const [titleName, setTitleName] = React.useState("");
  const [newContent, setNewContent] = React.useState("");
  const [showPost, setPost] = React.useState(false);
  const currDate = Date().toLocaleString();
  // const [selectedSite, setSelectedSite] = React.useState({});

  React.useEffect(() => {
    fetch("http://localhost:3014/getBlogPosts", {
      method: "GET",
      headers: {
        //accepts json
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json()) //converts to json
      .then(
        (result) => {
          const newData = result[0].blogPosts;
          setPostData(newData);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []); // [] = runs code before the component

  const onTitleChange = (event) => {
    setTitleName(event.target.value);
  };
  const onContentChange = (event) => {
    setNewContent(event.target.value);
  };
  const history = useHistory();

  const addPost = (event) => {
    const author = firebase.auth().currentUser.email;

    const data = {
      postId:
        postData?.length > 0 ? postData[postData?.length - 1].postId + 1 : 1,
      title: titleName,
      contents: newContent,
      date: currDate,
      author: author,
    };
    fetch("http://localhost:3014/sendBlogPosts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
    window.open("http://localhost:3000/my-posts");
  };

  return (
    <div className="justify-center">
      <form>
        <h1>Create New Post</h1>
        <input type="file" className="filetype" id="group_image" />
        <p> Date posted: {currDate}</p>
        <br></br>
        <input
          className="title"
          type="text"
          placeholder="title"
          size="39"
          required
          onChange={onTitleChange}
        />
        <br />
        <br />
        <textarea
          className="content"
          placeholder="contents"
          rows="8"
          cols="41"
          required
          onChange={onContentChange}
        ></textarea>
        <br />
        <br />
        <button className="btn-save" onClick={addPost}>
          Save Post
        </button>
      </form>
    </div>
  );
};
