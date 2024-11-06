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
    userId: string;
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
    const audioOutputRef = useRef([])

    const [messages, setMessages] = useState<Message[]>([
        { text: 'Connecting to chat...', type: 'server', date: new Date() },
    ]);
    const [inputValue, setInputValue] = useState('');

    function chunking(data, length) {
        const result = [];
        for (let i = 0; i < data.length; i += length) {
            result.push(data.subarray(i, i + length));
        }
        return result;
    }

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
            const res = JSON.parse(event.data);
            if (res.$type === 'user_id') {
                localStorage.setItem('userId', JSON.stringify(res.userId));
            } else {
                if (res.$type !== 'empty') {
                    const float32Array = new Float32Array(res.sound);
                    // console.log(res);

                    console.log(chunking(float32Array, 128));

                    const audioContext = audioContextRef.current;
                    console.log(audioContext);
                    if (audioContext) {
                        // Накопление данных в audioChunksRef
                        audioOutputRef.current.push(...float32Array);

                        const BUFFER_SIZE_THRESHOLD = 4096; // Увеличьте порог до 4096 или больше

                        // Воспроизводим звук только если накоплен нужный объем данных
                        if (audioOutputRef.current.length >= BUFFER_SIZE_THRESHOLD) {
                            const sampleRate = 15000; // Убедитесь, что это соответствует записи

                            // Создаем буфер и копируем накопленные данные
                            const bufferToPlay = new Float32Array(audioOutputRef.current);
                            const audioBuffer = audioContext.createBuffer(
                                1,
                                bufferToPlay.length,
                                sampleRate
                            );
                            audioBuffer.copyToChannel(bufferToPlay, 0);

                            // Воспроизведение накопленного буфера
                            const source = audioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioContext.destination);
                            source.start();

                            // Очистим буфер после воспроизведения
                            audioOutputRef.current = [];
                        }
                    }
                }
            }
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
        const initAudioContext = async () => {
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new AudioContext({sampleRate: 15000});

                // Загрузка модуля AudioWorklet
                try {
                    await audioContextRef.current.audioWorklet.addModule('../src/helpers/audio.js');
                } catch (error) {
                    console.error('Error loading AudioWorklet module:', error);
                }
            }
        };

        const checkPermissions = async () => {
            try {
                // Пробуем получить доступ к микрофону
                await navigator.mediaDevices.getUserMedia({ audio: true });
                return true; // Доступ к микрофону разрешен
            } catch (error) {
                console.error('Microphone access denied:', error);
                return false;
            }
        };

        const initMediaRecorder = async () => {
            try {
                const hasPermission = await checkPermissions();
                if (!hasPermission) return;

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);

                // Создаем источник для AudioContext и подключаем к AudioWorkletNode
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                workletNodeRef.current = new AudioWorkletNode(
                    audioContextRef.current,
                    'audio-processor',
                );

                workletNodeRef.current.port.onmessage = (event) => {
                    audioChunksRef.current.push(...event.data);

                    if (audioChunksRef.current.length > 1920) {
                        const data = {
                            $type: 'voice',
                            soundFrame: {
                                room: '00000000-0000-0000-0000-000000000000',
                                userId: JSON.parse(localStorage.getItem('userId')),
                                sound: Array.from(audioChunksRef.current),
                            },
                        };

                        webSocket.send(JSON.stringify(data));

                        audioChunksRef.current = [];
                    }

                    // const BUFFER_SIZE_THRESHOLD = 4096;

                    // if (audioChunksRef.current.length >= BUFFER_SIZE_THRESHOLD) {
                    //     const sampleRate = 15000; // Частота дискретизации (проверьте правильность)
                    //     const float32Array = new Float32Array(audioChunksRef.current);

                    //     // Создаем аудиоконтекст, если не существует или закрыт

                    //     const audioContext = audioContextRef.current;

                    //     // Создаем аудиобуфер
                    //     const audioBuffer = audioContext.createBuffer(
                    //         1,
                    //         float32Array.length,
                    //         sampleRate
                    //     );
                    //     audioBuffer.copyToChannel(float32Array, 0);

                    //     // Создаем источник и воспроизводим буфер
                    //     const source = audioContext.createBufferSource();
                    //     source.buffer = audioBuffer;
                    //     source.connect(audioContext.destination);
                    //     source.start();

                    //     // Очистим буфер после проигрывания
                    //     audioChunksRef.current = [];
                    // }
                };

                sourceRef.current.connect(workletNodeRef.current);
                workletNodeRef.current.connect(audioContextRef.current.destination);

                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
            } catch (error) {
                console.error('Error accessing the microphone:', error);
            }
        };

        const startRecording = async () => {
            await initAudioContext();
            await initMediaRecorder();

            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
        };

        if (microState) {
            startRecording();
        } else {
            if (audioContextRef.current && audioContextRef.current.state === 'running') {
                audioContextRef.current.suspend();
            }
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            if (sourceRef.current) {
                sourceRef.current.disconnect();
                sourceRef.current = null;
            }
            if (workletNodeRef.current) {
                workletNodeRef.current.disconnect();
                workletNodeRef.current = null;
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            audioChunksRef.current = [];
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
