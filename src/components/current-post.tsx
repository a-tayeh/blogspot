import React from "react";
import { Button } from "react-bootstrap";
import firebase from "../firebase";
import { Comments } from "../comments";

type props = {
  cardBody: string;
  cardTitle: string;
  cardDate: string;
  author: string;
  postId: string;
};
export const CurrentPost: React.FC<props> = ({
  cardBody,
  cardTitle,
  cardDate,
  author,
  postId,
}) => {
  // const [commentData, setCommentData] = React.useState([]);
  const [postData, setPostData] = React.useState([]);
  const [newComment, setComment] = React.useState("[]");
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

  const onCommentChange = (event: any) => {
    setComment(event.target.value);
  };

  const addComment = (event: any) => {
    const author = firebase.auth().currentUser?.email;

    const data = {
      commentData: { comment: newComment, date: currDate, author: author },

      postID: postId,
    };
    fetch("http://localhost:3014/addComments", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(
      (result) => {
        console.log("data sent successfully");
        window.location.reload(true);
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  };

  const date = new Date(cardDate);
  return (
    <div className="container">
      <br></br>
      <h3>{cardTitle}</h3>

      <h4>{date?.toDateString()}</h4>
      <h4>{author}</h4>
      <p>{cardBody}</p>
      <div>
        <br></br>
        <br></br>
        <textarea
          className="center"
          placeholder="comment"
          onChange={onCommentChange}
        ></textarea>
        <br></br>
        <button className="post" onClick={addComment}>
          {" "}
          post
        </button>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <br></br>
      <div>
        <Comments postId={postId} />
      </div>
    </div>
  );
};
