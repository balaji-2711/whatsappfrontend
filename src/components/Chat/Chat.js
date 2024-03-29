import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import axios from "../../axios";
import { useParams } from "react-router-dom";
import { useStateValue } from "../ContextApi/StateProvider";
import Pusher from "pusher-js";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [{ user }] = useStateValue();

  //to get the room and message details based on roomId
  useEffect(() => {
    if (roomId) {
      axios.get(`/room/${roomId}`).then((response) => {
        setRoomName(response.data.name);
        setUpdatedAt(response.data.updatedAt);
      });
      axios.get(`/messages/${roomId}`).then((response) => {
        setMessages(response.data);
      });
    }
  }, [roomId]);

  //to display the random avatar
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input) {
      return;
    }

    await axios.post(`/messages/new`, {
      message: input,
      name: user.displayName,
      timestamp: new Date(),
      uid: user.uid,
      roomId,
    });

    setInput("");
  };

  useEffect(() => {
    // const pusher = new Pusher("6fbb654a0e0b670de165", {
    const pusher = new Pusher("07c9834a6717e04aa389", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="chat">
      <div className="chat__header">
        {/* <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} /> */}
        {/* <Avatar /> */}
        <Avatar src={`https://api.dicebear.com/7.x/fun-emoji/svg`} />

        {/* https://api.dicebear.com/7.x/fun-emoji/svg */}

        <div className="chat__headerInfo">
          <h3>{roomName ? roomName : "Welcome to Whatsapp"}</h3>
          <p>Last updated at {new Date(updatedAt).toString().slice(0, 25)}</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message, index) => (
          <p
            className={`chat__message ${
              message.uid === user.uid && "chat__receiver"
            }`}
            // key={message?.id ? message?.id : index}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp).toString().slice(0, 25)}
            </span>
          </p>
        ))}
      </div>

      {roomName && (
        <div className="chat__footer">
          <InsertEmoticon />
          <form>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              type="text"
            />
            <button onClick={sendMessage}>Send a message</button>
          </form>
          <Mic />
        </div>
      )}
    </div>
  );
};

export default Chat;
