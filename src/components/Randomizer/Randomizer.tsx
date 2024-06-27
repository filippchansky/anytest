import { useState } from "react";

export const Randomizer = () => {
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(100);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const generateRandomNumber = () => {
    setRandomNumber(Math.floor(Math.random() * (max - min + 1) + min));
  };

  return (
    <div>
      <label>
        Минимальное число:
        <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} />
      </label>
      <br />
      <label>
        Максимальное число:
        <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} />
      </label>
      <br />
      <button onClick={generateRandomNumber}>Сгенерировать число</button>
      <br />
      {randomNumber !== null && <p>Сгенерированное число: {randomNumber}</p>}
    </div>
  );
};