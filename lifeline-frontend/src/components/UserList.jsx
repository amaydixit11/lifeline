// UserList.jsx

import React from "react";

const UserList = ({ users }) => {
  return (
    <ul className="text-lg text-black font-semibold">
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UserList;
