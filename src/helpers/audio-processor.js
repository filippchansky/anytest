class MyAudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs) {
        const input = inputs[0];
        const output = outputs[0];

        if (input.length > 0) {
            // Скопируйте данные из входного буфера в выходной
            for (let channel = 0; channel < output.length; ++channel) {
                if (input[channel]) {
                    output[channel].set(input[channel]);
                }
            }
        }
        return true; // Вернуть true, чтобы процессор продолжал работать
    }
}

registerProcessor('my-audio-processor', MyAudioProcessor);
