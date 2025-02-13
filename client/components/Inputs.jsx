import { useRef, useState } from "react";
import { Button, Input } from "@heroui/react";
import { ImageUpIcon, SendHorizonalIcon } from "lucide-react";

export default function Inputs({ socket, name, setMessages }) {
  const [input, setInput] = useState("");
  const imageEl = useRef(null);

  const onImageUpload = async (e) => {
    const file = e.target.files[0];

    // BASE 64
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64String = reader.result;

      const msg = {
        type: "image",
        content: base64String,
        user: {
          id: socket.id,
          name: name,
        },
      };

      socket.emit("message", msg);
      setMessages((prevState) => [...prevState, msg]);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!input) {
      imageEl.current.click();
      return;
    }

    const msg = {
      type: input.startsWith("https") ? "link" : "text",
      content: input,
      user: {
        id: socket.id,
        name: name,
      },
    };

    socket.emit("message", msg); // This line sends the message to the server via your socket connection.
    setMessages((prevState) => [...prevState, msg]); // This line immediately updates the local state of the component, adding the message to the chat display.

    setInput("");
  };

  return (
    // message input bar at the bottom of the screen
    <form
      className="absolute bottom-3 w-full flex gap-1 sm:gap-1 mb-1 sm:mb-2 px-0 sm:px-8 max-w-6xl left-1/2 -translate-x-1/2"
      onSubmit={onSubmit}
    >
      <Input
        type="text"
        value={input}
        placeholder="Enter a message..."
        onChange={(e) => setInput(e.target.value)}
        autoComplete="off"
      />

      <input
        type="file"
        name="file"
        accept="image/png, image/webp, image/jpeg"
        ref={imageEl}
        onChange={onImageUpload}
        hidden
      />

      <Button type="Submit" className="bg-blue-100">
        {input ? <SendHorizonalIcon /> : <ImageUpIcon />}
      </Button>
    </form>
  );
}
