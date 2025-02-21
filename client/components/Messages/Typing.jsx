import React, { useState } from 'react';


function Chat() {
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (event) => {
    setMessage(event.target.value);
    setIsTyping(event.target.value.length > 0);
  };

  return (
    <div>
      <input type="text" value={message} onChange={handleInputChange} />
      {isTyping && <p>Someone is typing...</p>}
    </div>
  );
}

export default Chat;