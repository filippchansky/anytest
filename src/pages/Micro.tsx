import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

interface MicroProps {}

const Micro: React.FC<MicroProps> = () => {
    const [microState, setMicroState] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioContextRef = useRef<AudioContext>(null);
    const sourceRef = useRef(null);
    const workletNodeRef = useRef(null);

    useEffect(() => {
        const initMediaRecorder = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);

                // Инициализация AudioContext
                audioContextRef.current = new window.AudioContext();
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                sourceRef.current.connect(audioContextRef.current.destination); // Подключение к динамикам

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
                    console.log(float32Array); // Выводим данные в консоль
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
            <h1>Audio Recorder</h1>
            <Button variant='contained' onClick={() => setMicroState((prev) => !prev)}>
                {microState ? 'Stop' : 'Start '}
            </Button>
        </div>
    );
};
export default Micro;
