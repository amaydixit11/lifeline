// UserNode.jsx

import React from "react";

const UserNode = ({ name, id }) => {
  console.log(id);
  return (
    <div
      className="user-node"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "120px",
        height: "60px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#fff",
      }}
    >
      <h3>{name}</h3>
      {/* <p>ID: {id}</p> */}
    </div>
  );
};

export default UserNode;
