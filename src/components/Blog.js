import { render } from "@testing-library/react";
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreatePost from "../Routes/CreatePost";
import MyPosts from "../Routes/MyPosts";

const Blog = ({ handleLogout }) => {
  return (
    <section className="blog">
      <Router>
        <nav>
          <h2>BLOG SPOT</h2>

          <Link to="/create-post">
            <div className="blog-right">Create Post</div>
          </Link>

          <Link to="/my-posts">
            <div className="blog-right">My Posts</div>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>

        <Switch>
          <Route exact path="/create-post">
            <CreatePost />
          </Route>
          <Route exact path="/my-posts">
            <MyPosts />
          </Route>
          {/* <Route exact path="/">
            <Blog />
          </Route> */}
        </Switch>
      </Router>
    </section>
  );
};

export default Blog;
