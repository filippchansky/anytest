import { Button, TextField } from '@mui/material';
import { useWebSocket } from '@siberiacancode/reactuse';
import React, { useState } from 'react';

interface WebSocketProps {}

interface Message {
    text: string;
    type: 'client' | 'server';
    date: Date;
}

const WebSocket: React.FC<WebSocketProps> = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Connecting to chat...', type: 'server', date: new Date() },
    ]);
    const [inputValue, setInputValue] = useState('');

    // ws://v2641459.hosted-by-vdsina.ru:8080/ws
    const webSocket = useWebSocket('ws://v2641459.hosted-by-vdsina.ru:8080/ws', {
        onConnected: (webSocket) =>
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: `Connected to ${webSocket.url}`, type: 'server', date: new Date() },
            ]),
        onMessage: (event) => {
            console.log(event);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: event.data, type: 'server', date: new Date() },
            ]);
        },
        onDisconnected: () => {
            // webSocket.send('хуй')
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Disconnected', type: 'server', date: new Date() },
            ]);
        },
    });

    console.log(webSocket);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <>
            <h1>hello пидарасы, status: {webSocket.status}</h1>

            <TextField onChange={handleChange} />
            <Button onClick={() => webSocket.send(inputValue)}>send</Button>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <span>
                            <code>
                                {message.date.toLocaleTimeString()} {message.type}
                            </code>{' '}
                        </span>
                        {message.text}
                    </div>
                ))}
            </div>
        </>
    );
};
export default WebSocket;
