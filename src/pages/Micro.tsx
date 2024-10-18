import { Webcam } from '@webcam/react';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

interface MicroProps {}

const Micro: React.FC<MicroProps> = () => {
    const [start, setStart] = useState(false);
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const processorRef = useRef(null);

    useEffect(() => {
        const startRecording = async () => {
            try {
                // Получаем доступ к микрофону
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
  
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      console.log(event.data); // Отправляем закодированный аудио файл на сервер
    }
  };

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
                    console.log(inputBuffer)
                    // Создаем пустой аудиобуфер для воспроизведения
                    const audioBuffer = audioContextRef.current.createBuffer(1, inputBuffer.length, audioContextRef.current.sampleRate);
                    audioBuffer.copyToChannel(inputBuffer, 0, 0);
    
                    // Создаем источник и проигрываем звук
                    const source = audioContextRef.current.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContextRef.current.destination);
                    source.start();
                };
            } catch (error) {
                console.error('Error accessing the microphone:', error);
            }
        };
    
        if (start) {
            startRecording();
        }
    
        return () => {
            console.log('unmoant')
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
            <Webcam/>
        </div>
    );
};
export default Micro;
