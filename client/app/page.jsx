"use client";
import { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { Messages, Inputs, SignUp } from "@/components";
import { io } from "socket.io-client";

const socket = io("https://chat-app-mvgq3.kinsta.app/");

export default function Home() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("new_message", (msg) => {
      setMessages((prevState) => [...prevState, msg]);
    });
  }, []);

  useEffect(() => {
    socket.on("new_user", (name) => {
      const msg = {
        type: "user",
        content: name,
        user: {
          id: 0,
          name: "",
        },
      };

      setMessages((prevState) => [...prevState, msg]);
    });
  }, []);

  return (
    <HeroUIProvider>
      <div className="min-h-screen max-h-screen">
        {!user ? (
          <SignUp setUser={setUser} socket={socket} />
        ) : (
          <div className="relative min-h-screen max-h-screen">
            <Messages messages={messages} id={socket.id} />
            <Inputs socket={socket} name={user} setMessages={setMessages} />
          </div>
        )}
      </div>
    </HeroUIProvider>
  );
}
