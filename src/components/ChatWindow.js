import React, { useState } from 'react';
import '../styles/ChatWindow.css';

function ChatWindow({ selectedChat, goBack }) {
  const [messages, setMessages] = useState([
    { sender: 'me', text: 'Бу! испугался?', time: '10:00' },
    { sender: 'user', text: 'Не бойся я друг!', time: '10:02' },
    { sender: 'me', text: 'Я тебя не обижу!', time: '10:05' },
    { sender: 'user', text: 'Иди сюда иди ко мне!', time: '10:02' },
    { sender: 'me', text: 'Сядь рядом со мной!', time: '10:05' },
    { sender: 'user', text: 'Посмотри мне в глаза!', time: '10:02' },
    { sender: 'me', text: 'Ты видишь меня?', time: '10:00' },
    { sender: 'user', text: 'Я тоже тебя вижу!', time: '10:02' },
    { sender: 'me', text: 'Давай смотреть друг на друга до тех пор пока наши глаза не устанут!', time: '10:05' },
    { sender: 'user', text: 'Ты не хочешь?', time: '10:02' },
    { sender: 'me', text: 'Почему?', time: '10:05' },
    { sender: 'user', text: 'Что-то не так?', time: '10:02' },


  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { sender: 'me', text: newMessage, time: new Date().toLocaleTimeString().slice(0, 5) },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-button" onClick={goBack}>Назад к чатам</button>
        <div className="chat-header-info">
          <img src={selectedChat.photo} alt="user" className="chat-header-photo" />
          <h2>{selectedChat.user}</h2>
        </div>
        <button className="block-button" onClick={() => alert('Пользователь заблокирован')}>Заблокировать</button>
      </div>
      <div className="chat-history">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender === 'me' ? 'my-message' : 'user-message'}`}
          >
            <p>{message.text}</p>
            <span className="message-time">{message.time}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Введите сообщение"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Отправить</button>
      </div>
    </div>
  );
}

export default ChatWindow;
