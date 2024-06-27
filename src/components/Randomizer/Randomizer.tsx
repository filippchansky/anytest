import { Button, TextField } from "@mui/material";
import { useState } from "react";

export const Randomizer = () => {
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(0);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const generateRandomNumber = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours}:${minutes}`;
    if (
      timeString === "17:00" ||
      timeString === "17:01" ||
      timeString === "17:02" ||
      timeString === "17:03" ||
      timeString === "17:04" ||
      timeString === "17:05"
    ) {
      setRandomNumber(228);
    } else {
      setRandomNumber(Math.floor(Math.random() * (max - min + 1) + min));
    }
  };

  return (
    <div className="flex justify-center w-screen h-screen items-center">
      <div className="flex gap-5">
        <div className="flex flex-col gap-5">
          <TextField
            onChange={(e) => setMin(Number(e.target.value))}
            id="standard-password-input"
            label="Минимальное число"
            type="number"
            autoComplete="current-password"
            variant="outlined"
          />
          <TextField
            onChange={(e) => setMax(Number(e.target.value))}
            id="standard-password-input"
            label="Максимальное число"
            type="number"
            autoComplete="current-password"
            variant="outlined"
          />
          <Button onClick={generateRandomNumber} variant="contained">
            Сгенерировать
          </Button>
        </div>
        <div className="flex flex-col gap-7 items-center">
          <h1>Рандомное число:</h1>
          <p>{randomNumber}</p>
        </div>
      </div>
    </div>
  );
};
