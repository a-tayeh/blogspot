import React from "react";
import { Card } from "react-bootstrap";

type props = {
  postId: string;
};
export const Comments: React.FC<props> = ({ postId }) => {
  const [comments, setcomments] = React.useState([]);
  const [viewcomment, setViewcomment] = React.useState(false);
  const [articlePage, setArticlePage] = React.useState("");
  //   const [selectedcomment, setSelectedcomment] = React.useState({});
  React.useEffect(() => {
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
  }, []);

  return (
    <div className="container">
      {comments.map((comment: any) => (
        <div>
          <Card>
            <Card.Img variant="top" src="holder.js/100px180" />
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
