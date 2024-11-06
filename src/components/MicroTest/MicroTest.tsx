import { Webcam } from '@webcam/react';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';

interface MicroProps {}

const Micro: React.FC<MicroProps> = () => {
    const [start, setStart] = useState(false);
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const processorRef = useRef(null);

    const compression = async (data: Uint8Array) => {
        const ds = new CompressionStream('gzip');
        const writer = ds.writable.getWriter();
        writer.write(data);
        writer.close();
        return await new Response(ds.readable).arrayBuffer();
        // return ds
    };

    useEffect(() => {
        const startRecording = async () => {
            try {
                // Получаем доступ к микрофону
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Создаем AudioContext
                audioContextRef.current = new (window.AudioContext || window.AudioContext)();

                // Создаем источник из медиа потока
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

                // Создаем ScriptProcessorNode
                processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

                // Подключаем источник к процессору
                sourceRef.current.connect(processorRef.current);
                processorRef.current.connect(audioContextRef.current.destination);

                // Обрабатываем аудио данные
                processorRef.current.onaudioprocess = (event) => {
                    const inputBuffer = event.inputBuffer.getChannelData(0); // Получаем данные первого канала
                    const byteArray = new Uint8Array(inputBuffer.length * 2);
                    for (let i = 0; i < inputBuffer.length; i++) {
                        const sample = Math.max(-1, Math.min(1, inputBuffer[i])); // Ограничиваем значения
                        byteArray[i * 2] = sample < 0 ? 0 : sample * 255; // Преобразуем в байты
                        byteArray[i * 2 + 1] = sample < 0 ? 0 : sample * 255;
                    }
                    compression(byteArray).then(data => {
                        const xuy = new Uint8Array(data)
                        console.log(xuy)
                    })
                    // console.log(); // Ваш массив байтов
                };
            } catch (error) {
                console.error('Error accessing the microphone:', error);
            }
        };

        if (start) {
            startRecording();
        }

        return () => {
            // Остановите поток и очистите ресурсы при размонтировании компонента
            if (sourceRef.current) sourceRef.current.disconnect();
            if (processorRef.current) processorRef.current.disconnect();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [start]);

    return (
        <div>
            <button onClick={() => setStart((prev) => !prev)}>
                {start ? 'закончить' : 'начать'}
            </button>
        </div>
    );
};
export default Micro;
