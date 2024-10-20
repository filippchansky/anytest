// audio-processor.js
class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputs) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const channelData = input[0]; // Получаем данные первого канала
            // Отправляем данные обратно в основной поток
            this.port.postMessage(channelData);
        }
        return true; // Возвращаем true, чтобы продолжить процесс
    }
}

// Регистрируем AudioWorkletProcessor
registerProcessor('audio-processor', AudioProcessor);
