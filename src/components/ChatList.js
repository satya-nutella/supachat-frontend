import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import { useAuth } from "../contexts/auth.context";
import { firestore } from "../firebase";
import socket from "../socket";
import { useCollectionData } from "react-firebase-hooks/firestore";

const UserList = ({ activeUsers }) => {
  const { currentUser } = useAuth();

  return (
    <>
      <Table>
        <tbody>
          {activeUsers.map(({ uid, username }) => (
            <tr key={uid}>
              <td>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontSize: "1.5rem",
                  }}
                  to={`/${
                    uid > currentUser.uid
                      ? currentUser.uid + uid
                      : uid + currentUser.uid
                  }`}
                >
                  {username}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default function ChatList() {
  const [activeUsers, setActiveUsers] = useState([]);
  const { currentUser } = useAuth();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef
    .where("rid", "==", currentUser.uid)
    .where("status", "!=", "🟢");
  const [messages] = useCollectionData(query, { idField: "id" });

  messagesRef
    .where("rid", "==", currentUser.uid)
    .where("status", "==", "🔴")
    .get()
    .then((response) => {
      let batch = firestore.batch();
      response.docs.forEach((doc) => {
        const docRef = messagesRef.doc(doc.id);

        batch.update(docRef, {
          status: "🟡",
        });
      });

      batch.commit().then(() => {
        console.log("Marked as delivered");
      });
    });

  useEffect(() => {
    socket.auth = {
      username: currentUser.email.split("@")[0],
      uid: currentUser.uid,
    };
    socket.connect();
  }, [currentUser]);

  useEffect(() => {
    socket.on("users", (users) => {
      setActiveUsers(users);
    });
  }, []);

  return (
    <>
      <Navigation />
      <Container className="text-center">
        <h3 className="text-warning">
          You have {(messages && messages.length) || 0} new messages
        </h3>
        <UserList activeUsers={activeUsers} />
      </Container>
    </>
  );
}
