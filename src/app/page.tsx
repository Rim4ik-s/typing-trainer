"use client";
import React, { useEffect, useRef, useState } from "react";

const sentences = [
  "Солнце светит ярко на небе, заливая все вокруг теплым светом.",
  "Лес шумит своими зелеными кронами под легким ветерком.",
  "Дети играют в парке, смеясь и бегая вокруг фонтана.",
  "Море шумит волнами, разбиваясь о берег с белыми пенными гребнями.",
  "Горы возвышаются над долиной, словно стражи природы, охраняющие ее от злых сил.",
  "Воздух наполнен ароматами цветущих полей, создавая волшебное ощущение весеннего вдохновения.",
  "Городской сквер украшен красочными цветами, привлекая взгляды прохожих своей красотой.",
  "Птицы чирикают в ветвях деревьев, напоминая о приближении нового дня.",
  "Вечернее небо расцвечено разноцветными отблесками заката, словно художественное полотно великого мастера.",
  "Река плывет спокойно и тихо, отражая в своих водах отблески заката и облаков.",
  "The sun sets behind the mountains, painting the sky with hues of orange and pink.",
  "A gentle breeze rustles the leaves of the old oak tree, creating a soothing sound.",
  "Children laugh and play in the meadow, chasing colorful butterflies in the warm summer air.",
  "The waves crash against the shore, creating a symphony of soothing sounds.",
  "The city comes alive at night, with neon lights and bustling streets filled with energy.",
  "The ancient ruins stand as a testament to the glory of a bygone era, intriguing all who visit.",
  "Birds chirp melodiously as they flit from branch to branch, adding to the peaceful ambiance of the forest.",
  "The aroma of freshly baked bread wafts through the air, enticing passersby with its comforting scent.",
  "Stars twinkle in the night sky, forming intricate patterns that have fascinated people for centuries.",
  "The river flows steadily, reflecting the moonlight like a shimmering ribbon cutting through the landscape.",
];

export interface StatsType {
  time: Time
  symbols: Symbols
  errors: Errors
  errorsPercent: ErrorsPercent
  symbolsPerMinute: SymbolsPerMinute
}

export interface Time {
  name: string
  value: number
}

export interface Symbols {
  name: string
  value: number[]
}

export interface Errors {
  name: string
  value: number[]
}

export interface ErrorsPercent {
  name: string
  value: number
}

export interface SymbolsPerMinute {
  name: string
  value: number
}

export default function Home() {
  const textRef = useRef(null);
  let [currentText, setCurrentText] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(-1);
  let [currentKeyIndex, setCurrentKeyIndex] = useState(0);

  let [stats, setStats] = useState<StatsType>({
    time: { name: "Время ", value: 0 },
    symbols: { name: "Знаки ", value: [] },
    errors: { name: "Ошибки ", value: [] },
    errorsPercent: { name: "Процент ошибок ", value: 0 },
    symbolsPerMinute: { name: "Знаки в минуту ", value: 0 },
  });

  useEffect(() => {
    if (isGameStarted) {
      setTimeout(() => {
        stats.time.value = stats.time.value + 0.1;
        if (stats.errors.value.length != 0) {
          stats.errorsPercent.value =
            (  stats.errors.value.length / stats.symbols.value.length ) * 100;
        }

        stats.symbolsPerMinute.value =
          stats.symbols.value.length / stats.time.value * 60;
        if (isGameStarted) {
          setStats({ ...stats });
        }

        setCurrentSecond(currentSecond + 1);
      }, 100);
    }
  }, [currentSecond, isGameStarted]);

  useEffect(() => {
    if (!isGameStarted) {
      return;
    }
    currentText = sentences[Math.floor(Math.random() * sentences.length)];
    setCurrentText(currentText);
    //keyhandler end
  }, [isGameStarted]);

  useEffect(() => {
    if (currentText === "") {
      return;
    }

    function onClick(event: KeyboardEvent) {
      if (currentKeyIndex == currentText.length - 1) {
        setIsGameStarted(false);
        setCurrentKeyIndex(0);
        setCurrentSecond(-1);
        window.removeEventListener("keypress", onClick);
        return;
      }

      const symbol = currentText[currentKeyIndex];


      if (event.key == symbol) {
        stats.symbols.value.push(currentKeyIndex);
      } else {
        stats.symbols.value.push(currentKeyIndex);
        stats.errors.value.push(currentKeyIndex);
      }

      setStats({ ...stats });

      currentKeyIndex = currentKeyIndex + 1;
      setCurrentKeyIndex(currentKeyIndex);
    }

    //keyhandler start
    window.addEventListener("keypress", onClick);
  }, [currentText]);

  return (
    <main className="h-screen max-h-screen text-white">
      <header className="header p-2 h-1/6">
        <h1 className=" underline title white text-center text-white font-bold text-5xl md:text-9xl">
          Starkov
          <span className="font-italic font-normal text-xl">
            typing&nbsp;test
          </span>
        </h1>
      </header>
      <div className="p-8 h-5/6 w-full inline-flex flex-col justify-around">
        {isGameStarted ? (
          <>
            <div className="text-container">
              <p ref={textRef} className="text-center text-2xl">
                {currentText.split("").map((item, index) => {
                  return (
                    <span
                      key={index}
                      className={
                        (index == currentKeyIndex ? "symbol-current" : "") +
                   
                        (stats.symbols.value.includes(index)
                          ? stats.errors.value.includes(index)
                            ? "symbol-error"
                            : "symbol-success"
                          : "") +
                        " text-white "
                      }
                    >
                      {item}
                    </span>
                  );
                })}
              </p>
            </div>
          </>
        ) : (
          <div className="button-container flex h-max">
            <button
              className="m-auto start-game-button button p-3 border text-white"
              onClick={() => {
                setIsGameStarted(true);
                setCurrentKeyIndex(0);

                stats = {
                  time: { name: "Время ", value: 0 },
                  symbols: { name: "Знаки ", value: [] },
                  errors: { name: "Ошибки ", value: [] },
                  errorsPercent: { name: "Процент ошибок ", value: 0 },
                  symbolsPerMinute: {
                    name: "Знаки в минуту ",
                    value: 0,
                  },
                };
                setStats({ ...stats });
              }}
            >
              Начать тест
            </button>
          </div>
        )}
        <div className="stats-container rounded-md">
          {Object.values(stats).map((value, index) => {
            return (
              <p key={index} className="p-2 gap-4 text-right">
                <span>{value.name}</span>
                <span className=" ml-5">
                  {typeof value.value === "object"
                    ? value.value.length
                    : Math.round(parseFloat(value.value) * 100) / 100}
                </span>
              </p>
            );
          })}
        </div>
      </div>
    </main>
  );
}
