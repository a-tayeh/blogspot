import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreatePost from "../Routes/CreatePost";
import { MyPosts } from "../Routes/my-posts";
import { Home } from "../Routes/home";

export const Blog = ({ handleLogout }) => {
  return (
    <section className="blog">
      <Router>
        <nav>
          <Link to="/home">
            <h3 className="blog-right">BLOG SPOT</h3>
          </Link>

          <Link to="/create-post">
            <h3 className="blog-right">Create Post</h3>
          </Link>

          <Link to="/my-posts">
            <h3 className="blog-right">My Posts</h3>
          </Link>
          <h3 className="blog-right" onClick={handleLogout}>
            {" "}
            Logout
          </h3>
        </nav>

        <Switch>
          <Route exact path="/create-post">
            <CreatePost />
          </Route>

          <Route exact path="/my-posts">
            <MyPosts />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          {/* <Route exact path="/">
            <Blog />
          </Route> */}
        </Switch>
      </Router>
    </section>
  );
};
