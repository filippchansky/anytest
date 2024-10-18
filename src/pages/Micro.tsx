import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

interface MicroProps {}

const Micro: React.FC<MicroProps> = () => {
    const [start, setStart] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef(null);
    const processorRef = useRef(null);

    useEffect(() => {
        const startRecording = async () => {
            try {
                // Получаем доступ к микрофону
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
                // Создаем AudioContext
                audioContextRef.current = new (window.AudioContext || window.AudioContext)();
    
                // Создаем источник из медиа потока
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    
                // Загружаем AudioWorklet
                await audioContextRef.current.audioWorklet.addModule('../helpers/audio-processor.js');
    
                // Создаем экземпляр AudioWorkletNode
                const workletNode = new AudioWorkletNode(audioContextRef.current, 'my-audio-processor');
    
                // Подключаем источник к worklet-узлу и worklet-узел к выходу
                sourceRef.current.connect(workletNode);
                workletNode.connect(audioContextRef.current.destination);
    
                // Выводим информацию о буфере (при необходимости)
                workletNode.port.onmessage = (event) => {
                    console.log(event.data);
                };
    
                // Обработка данных в AudioWorkletProcessor
                processorRef.current = workletNode;
    
            } catch (error) {
                console.error('Error accessing the microphone:', error);
            }
        };
    
        if (start) {
            startRecording();
        }
    
        return () => {
            console.log('unmount');
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
            {/* <Webcam /> */}
        </div>
    );
};
export default Micro;
