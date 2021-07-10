import React, { useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import { useAuth } from "../contexts/auth.context";
import { firestore } from "../firebase";
import socket from "../socket";

export function ChatMessage(props) {
  const { currentUser } = useAuth();

  const { text, uid, photoURL, status } = props.message;

  const messageClass = uid === currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt={`${uid}`} />
        <p>{text}</p>
        {messageClass === "sent" && <span>{status}</span>}
      </div>
    </>
  );
}

export default function ChatRoom() {
  const location = useLocation();
  const roomId = location.pathname.split("/")[1];

  const { currentUser } = useAuth();
  const dummy = useRef();
  const [formValue, setFormValue] = useState("");

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.where("roomId", "==", roomId).orderBy("createdAt");
  const [messages] = useCollectionData(query, { idField: "id" });

  messagesRef
    .where("rid", "==", currentUser.uid)
    .where("status", "in", ["🔴", "🟡"])
    .get()
    .then((response) => {
      let batch = firestore.batch();
      response.docs.forEach((doc) => {
        const docRef = messagesRef.doc(doc.id);
        const data = doc.data();

        batch.update(docRef, {
          status: data.roomId === roomId ? "🟢" : "🟡",
        });
      });

      batch.commit().then(() => {
        console.log("Marked all chats as read!");
      });
    });

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = currentUser;

    await messagesRef.add({
      roomId,
      text: formValue,
      createdAt: Date.now(),
      status: "🔴",
      uid,
      rid: roomId.replace(uid, ""),
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.auth = {
      username: currentUser.email.split("@")[0],
      uid: currentUser.uid,
    };
    socket.connect();
  }, [currentUser]);

  return (
    <>
      <Navigation />
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit" disabled={!formValue}>
          🚀
        </button>
      </form>
    </>
  );
}
