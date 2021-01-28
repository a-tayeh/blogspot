import React from "react";
import { Button, Card, CardColumns } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { CurrentPost } from "../components/current-post";

export const MyPosts = () => {
  const [posts, setPosts] = React.useState([]);

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

  const goToCarddetails = (cardId) => {
    localStorage.setItem("selectedCard", cardId);
    this.props.history.push("/current-post");

    // you can manage here to pass the clicked card id to the card details page if needed
  };

  return (
    <div class="card-columns">
      <div className="card">
        {posts.map((post) => (
          <Card
            onClick={() => this.goToCarddetails(post.id)}
            style={{ width: "18rem" }}
          >
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.date}</Card.Text>
              <Card.Text>{post.contents} </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
              Card footer title Goes Here
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
};
