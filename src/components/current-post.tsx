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
  const [newContent, setContent] = React.useState({ content: cardBody });
  const [newTitle, setTitle] = React.useState({ title: cardTitle });
  const currDate = Date().toLocaleString();
  const [edit, setEdit] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>();
  const [comments, setcomments] = React.useState([]);

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
          const blogPicNum =
            result[0]?.blogPosts?.length > 0
              ? result[0].blogPosts[result[0].blogPosts?.length - 1]?.postId
              : 1;
          document
            ?.getElementById("blogPic")
            ?.setAttribute(
              "src",
              `http://localhost:3014/getPic/${blogPicNum}-pic`
            );
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
    const currentUser = firebase?.auth()?.currentUser?.email;
    setCurrentUser(currentUser);

    const data = { postId: postId };
    fetch("http://localhost:3014/getPostComment", {
      method: "POST",
      headers: {
        //accepts json
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json()) //converts to json
      .then(
        (result) => {
          const newData = result;
          setcomments(newData);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []); // [] = runs code before the component

  const onContentChange = (event: any) => {
    setContent({ ...newContent, content: event.target.value });
  };
  const onCommentChange = (event: any) => {
    setComment(event.target.value);
  };
  const onSave = () => {
    const newBlogData = { postId: postId, newContents: newContent };
    fetch("http://localhost:3014/updatePosts", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBlogData),
    }).then(
      (result) => {
        console.log("data sent successfully");
      },
      (error) => {
        console.log("bro we got an error " + error);
      }
    );

    setEdit(false);
  };
  const addComment = (event: any) => {
    const author = firebase.auth().currentUser?.email;

    const data = {
      commentData: {
        comment: newComment,
        date: currDate,
        author: author,
        commentId: comments.length > 0 ? comments?.length + 1 : 1,
      },

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

  const onDelete = () => {
    const deleteData = { postId: postId };
    fetch("http://localhost:3014/removePosts", {
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
  };

  const date = new Date(cardDate);
  return !edit ? (
    <div className="container">
      <br></br>
      <button onClick={onDelete} className="btn-delete">
        Delete Post
      </button>
      <button className="btn-edit" onClick={() => setEdit(true)}>
        Edit
      </button>
      <h3>{cardTitle}</h3>
      <img src="" id="blogPic" />
      <h4>{date?.toDateString()}</h4>
      <h4>{author}</h4>
      <p>{newContent.content}</p>

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
        <Comments
          comments={comments}
          currentUser={currentUser}
          postId={postId}
        />
      </div>
    </div>
  ) : (
    <div className="container">
      <br></br>
      <button className="btn-save" onClick={onSave}>
        Save
      </button>
      <button className="btn-cancel" onClick={() => setEdit(false)}>
        Cancel
      </button>
      <input value={cardTitle} onChange={(event) => onContentChange(event)} />
      <h4>{date?.toDateString()}</h4>
      <h4>{author}</h4>
      <textarea onChange={(event) => onContentChange(event)}>
        {newContent.content}
      </textarea>
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
        <Comments
          comments={comments}
          currentUser={currentUser}
          postId={postId}
        />
      </div>
    </div>
  );
};
