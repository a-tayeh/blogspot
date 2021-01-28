import React from "react";
import { Button, Card } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { CurrentPost } from "../components/current-post";

export const Home = () => {
  const [posts, setPosts] = React.useState([]);
  const [articlePage, setArticlePage] = React.useState("");

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

  // const onChange = (event) => {
  //   <Router>
  //     <Link to="/current-post"></Link>

  //     <Switch>
  //       <Route exact path="/current-Post">
  //         <CurrentPost />
  //       </Route>
  //     </Switch>
  //   </Router>;
  // };
  // const routeTo = () => {
  //   window.open("http://localhost:3000/current-post"); //This will open Google in a new
  // };

  const goToCarddetails = (cardId) => {
    localStorage.setItem("selectedCard", cardId);
    this.props.history.push("/current-post");
    // you can manage here to pass the clicked card id to the card details page if needed
  };

  return (
    <div className="container">
      {posts.map((post) => (
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <p>{post.date}</p>
            <Card.Text>{post.contents} </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};
