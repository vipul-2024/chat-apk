import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default function Messages({ messages, id, teamName = "Vipul tech" }) {
  const scrollRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access denied or unavailable.");
    }
  };

  const stopCameraAccess = () => {
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach(track => track.stop());
      setVideoStream(null);
    }
  };

  return (
    <>
      <div className="bg-green-400 text-white w-full">
        <div className="container mx-auto flex flex-row justify-between items-center sm:px-5 py-2 px-2">
          <h1>{teamName}</h1>
          <ul className="flex flex-row gap-2 items-center">
            <h4>Network: {useOnlineStatus() ? "online" : "offline"}</h4>
            <button onClick={videoStream ? stopCameraAccess : handleCameraAccess} className="p-2 rounded bg-white text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d={videoStream ? "M15.75 19.5L8.25 12l7.5-7.5" : "M2.25 12l8.958-8.958c.1-.1.216-.156.332-.156h9.585a2.25 2.25 0 012.25 2.25v15.75c0 .116-.056.232-.156.332L13.25 21.75m-8.958-8.958L15.75 12m-4.5-4.5v9m-4.5-4.5H12"} />
              </svg>
            </button>
            {videoStream && (
              <video
                ref={ref => {
                  if (ref) {
                    ref.srcObject = videoStream;
                  }
                }}
                autoPlay
                playsInline
                muted
                className="rounded-lg w-20 h-20"
              />
            )}
          </ul>
        </div>
      </div>

      <div className="container mx-auto pt-5 min-h-[85vh] max-h-[85vh] overflow-scroll scrollbar-hidden px-5 py-3">
        <section className="flex gap-1 flex-col">
          {messages.map((message, index) => (
            <Chat
              key={index}
              own={message.user.id === id}
              name={message.user.name}
              type={message.type}
              content={message.content}
            />
          ))}
        </section>

        <div className="auto-scroll" ref={scrollRef}></div>
      </div>
    </>
  );
}