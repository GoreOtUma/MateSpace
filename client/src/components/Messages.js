import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import '../styles/Messages.css';
import userPhoto from '../img/anon.jpg';

function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [
    { id: 1, user: 'Артём Топалян', lastMessage: 'Я была неправа', date: '27.12.2021', photo: userPhoto },
    { id: 2, user: 'riddleforcop', lastMessage: 'Напишите первым!', date: null, photo: userPhoto },
    { id: 3, user: 'Валерия Колмогорова', lastMessage: 'А он хайповый парень', date: '27.12.2021', photo: userPhoto },
    { id: 4, user: 'Юрий Сёмин', lastMessage: 'Напишите первым!', date: null, photo: userPhoto },
  ];

  if (selectedChat) {
    return <ChatWindow selectedChat={selectedChat} goBack={() => setSelectedChat(null)} />;
  }

  return (
    <div className="messages-page">
      {chats.map(chat => (
        <div key={chat.id} className="chat-item" onClick={() => setSelectedChat(chat)}>
          <img src={chat.photo} alt={`${chat.user}`} className="chat-photo" />
          <div className="chat-details">
            <h4 className="chat-user">{chat.user}</h4>
            <p className="chat-last-message">
              {chat.lastMessage} {chat.date && <span className="chat-date">({chat.date})</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Messages;
