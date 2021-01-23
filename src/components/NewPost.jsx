import React from "react";
export const NewPost = () => {
  const [postData, setPostData] = React.useState([]);
  const [newPostName, setNewPostName] = React.useState("");
  const [showPost, setPost] = React.useState(false);
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
          const newData = result[0].data;
          setPostData(newData);
        },
        (error) => {
          console.log("bro we got an error " + error);
        }
      );
  }, []); // [] = runs code before the component

  const onNameChange = (event) => {
    setNewPostName(event.target.value);
  };

  const addPost = (event) => {
    const data = {
      id: postData[postData?.length - 1].id + 1,
      blogName: newPostName,
    };
    fetch("http://localhost:3012/createNewPost", {
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

  return (
    <div className="justify-center">
      <form>
        <h1>Create New Post</h1>
        <input
          type="text"
          placeHolder="title"
          size="39"
          required
          onChange={onNameChange}
        />
        <br />
        <br />
        <textarea
          className="center"
          placeHolder="contents"
          rows="8"
          cols="41"
          required
          // onChange={onChange}
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
