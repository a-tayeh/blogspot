import React from "react";

type props = {
  cardBody: string;
  cardTitle: string;
  cardDate: string;
  author: string;
};
export const CurrentPost: React.FC<props> = ({
  cardBody,
  cardTitle,
  cardDate,
  author,
}) => {
  const date = new Date(cardDate);
  return (
    <div className="container">
      <h3>{cardTitle}</h3>

      <h4>{date?.toDateString()}</h4>
      <h4>{author}</h4>
      <p>{cardBody}</p>
      <div>
        <textarea
          className="center"
          placeholder="Comment"

          // onChange={onContentChange}
        ></textarea>
      </div>
    </div>
  );
};
