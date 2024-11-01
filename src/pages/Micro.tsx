import { Button, TextField } from '@mui/material';
import { useWebSocket } from '@siberiacancode/reactuse';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

interface MicroProps {}

interface Message {
    text: string;
    type: 'client' | 'server';
    date: Date;
}

export interface IMicroData {
    $type: string;
    soundFrame: SoundFrame;
}

export interface SoundFrame {
    room: string;
    user: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sound: any[];
}

const Micro: React.FC<MicroProps> = () => {
    const [microState, setMicroState] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioContextRef = useRef<AudioContext>(null);
    const sourceRef = useRef(null);
    const workletNodeRef = useRef(null);


    const [messages, setMessages] = useState<Message[]>([
        { text: 'Connecting to chat...', type: 'server', date: new Date() },
    ]);
    const [inputValue, setInputValue] = useState('');

    // ws://v2641459.hosted-by-vdsina.ru:8080/ws
    const webSocket = useWebSocket('ws://v2641459.hosted-by-vdsina.ru:8080/ws', {
        onConnected: (webSocket) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: `Connected to ${webSocket.url}`, type: 'server', date: new Date() },
            ]);
        },
        onMessage: (event) => {
            console.log(JSON.parse(event.data));
            const res = JSON.parse(event.data)
            if(res.$type === 'user_id') {
                localStorage.setItem('userId', JSON.stringify(res.user))
            }
            console.log(event.data)
            setMessages((prevMessages) => [
                ...prevMessages,

                { text: event.data, type: 'server', date: new Date() },
            ]);
        },

        onDisconnected: () =>
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Disconnected', type: 'server', date: new Date() },
            ]),
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        const initMediaRecorder = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);

                // Инициализация AudioContext
                audioContextRef.current = new window.AudioContext();
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                // sourceRef.current.connect(audioContextRef.current.destination); // Подключение к динамикам

                // Загрузка AudioWorklet
                await audioContextRef.current.audioWorklet.addModule('../src/helpers/audio.js');

                // Создаем AudioWorkletNode после загрузки модуля
                workletNodeRef.current = new AudioWorkletNode(
                    audioContextRef.current,
                    'audio-processor'
                );

                // Обработка сообщений от AudioWorklet
                workletNodeRef.current.port.onmessage = (event) => {
                    const float32Array = event.data; // Получаем Float32Array из AudioWorklet
                    // console.log(float32Array); // Выводим данные в консоль
                    const data: IMicroData = {
                        $type: "voice",
                        soundFrame: {
                            room: '00000000-0000-0000-0000-000000000000',
                            user: JSON.parse(localStorage.getItem('userId')),
                            sound: Array.from(float32Array)
                        }

                    }
                    webSocket.send(JSON.stringify(data))
                };

                sourceRef.current.connect(workletNodeRef.current);
                workletNodeRef.current.connect(audioContextRef.current.destination); // Подключение для воспроизведения

                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
            } catch (error) {
                console.error('Error accessing the microphone: ', error);
            }
        };
        if (microState) {
            initMediaRecorder();
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            if (workletNodeRef.current) {
                workletNodeRef.current.disconnect();
            }
        };
    }, [microState]);

    return (
        <div>
            <h1>hello, status: {webSocket.status}</h1>

            <TextField onChange={handleChange} />
            <Button onClick={() => webSocket.send(inputValue)}>send</Button>
            <Button variant='contained' onClick={() => setMicroState((prev) => !prev)}>
                {microState ? 'Stop' : 'Start '}
            </Button>
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
            <h1>Audio Recorder</h1>
        </div>
    );
};
export default Micro;
