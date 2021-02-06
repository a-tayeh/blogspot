import { queryAllByDisplayValue } from "@testing-library/react";
import React from "react";
import { Button, Card } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { CurrentPost } from "../components/current-post";

export const MyPosts = () => {
  const [posts, setPosts] = React.useState([]);
  const [viewPost, setViewPost] = React.useState(false);
  const [articlePage, setArticlePage] = React.useState("");
  const [selectedPost, setSelectedPost] = React.useState({});
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
          setPosts(newData);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []);

  const handleClickedPost = (data) => {
    setSelectedPost({
      cardTitle: data.cardTitle,
      cardDate: data.cardDate,
      cardBody: data.cardBody,
      author: data.author,
      postId: data.postId,
    });
    setViewPost(true);
  };
  return !viewPost ? (
    <div className="my-posts-container">
      {posts.map((post) => (
        <div
          onClick={() =>
            handleClickedPost({
              cardTitle: post.title,
              cardDate: post.date,
              cardBody: post.contents,
              author: post.author || "",
              postId: post.postId,
            })
          }
        >
          <br></br>
          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>{post?.title}</Card.Title>
              <p>{new Date(post?.date)?.toDateString()}</p>
              <p>{post?.author?.length > 0 ? post?.author : ""}</p>
              <Card.Text className="text-truncate">
                {" "}
                <button class="content-button">{post?.contents}</button>{" "}
              </Card.Text>
            </Card.Body>
          </Card>
          <br></br>
        </div>
      ))}
    </div>
  ) : (
    <div className="container">
      <button onClick={() => setViewPost(false)}>go back</button>
      <CurrentPost
        cardBody={selectedPost.cardBody}
        cardTitle={selectedPost.cardTitle}
        cardDate={selectedPost.cardDate}
        author={selectedPost.author}
        postId={selectedPost.postId}
      />
    </div>
  );
};
