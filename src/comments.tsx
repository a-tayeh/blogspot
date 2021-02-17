import React from "react";
import { Card } from "react-bootstrap";
import firebase from "../src/firebase";

type props = {
  comments: any;
  currentUser:any;
  postId:string;
};
export const Comments: React.FC<props> = ({ comments,currentUser,postId }) => {
  const [viewcomment, setViewcomment] = React.useState(false);
  const [articlePage, setArticlePage] = React.useState("");
  //   const [selectedcomment, setSelectedcomment] = React.useState({});
  
  const onDelete=(commentId:string)=>{
    const deleteData={commentId:commentId,postId:postId};
    fetch("http://localhost:3014/removeComments", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteData),
    }).then(
      (result) => {
        console.log("data sent successfully");
        window.location.reload(true);
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );
  }
  return (
    <div className="container">
      {comments.map((comment: any) => (
        <div> 
          <Card className="comment">
            {comment.author === currentUser && <button onClick= {()=>onDelete(comment.commentId)}>Delete</button>}

            <Card.Body>
              {/* <Card.Title>{comment.title}</Card.Title> */}
              <p>{new Date(comment?.date)?.toDateString()}</p>
              <p>{comment?.author?.length > 0 ? comment.author : ""}</p>
              <Card.Text>
                {comment?.comment}
                {/* {" "}
                <button class="content-button">{comment.contents}</button>{" "} */}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};
