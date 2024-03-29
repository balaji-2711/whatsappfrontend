import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "../../axios";

const SidebarChat = ({ addNewChat, id, name }) => {
  //for avatar display
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  //to display the prompt to create new group
  const createChat = async () => {
    const roomName = prompt("Please enter name for chat group");
    if (roomName) {
      try {
        await axios.post("/group/create", {
          groupName: roomName,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        {/* <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} /> */}
        <Avatar src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix`} />
        {/* <Avatar src={`https://api.dicebear.com/7.x/fun-emoji/svg?flip`} /> */}

        {/* <Avatar /> */}

        <div className="sidebarChat__info">
          <h2>{name}</h2>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
};

export default SidebarChat;
