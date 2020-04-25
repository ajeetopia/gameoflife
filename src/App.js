import React, { useState, useCallback, useRef } from "react";
import "./App.css";
import produce from "immer";

const rows = 30;
const cols = 30;
function App() {
  const clearGame = () => {
    //return new Array(rows).fill(0).map(() => new Array(cols).fill(0));
    return [...Array(rows)].map((x) => Array(cols).fill(0));
  };
  const [matrix, setMatrix] = useState(() => {
    return clearGame();
  });

  const [isRunning, setRunState] = useState(false);

  const runRef = useRef(isRunning);
  runRef.current = isRunning;

  const runGameofLife = useCallback(() => {
    if (!runRef.current) {
      return;
    }
    setMatrix((g) => {
      return produce(g, (matrixClone) => {
        for (let i = 1; i < rows - 1; ++i) {
          for (let j = 1; j < cols - 1; ++j) {
            let sum =
              g[i - 1][j - 1] +
              g[i - 1][j] +
              g[i - 1][j + 1] +
              g[i][j - 1] +
              g[i][j + 1] +
              g[i + 1][j - 1] +
              g[i + 1][j] +
              g[i + 1][j + 1];

            if (matrixClone[i][j] && (sum === 2 || sum === 3)) {
              matrixClone[i][j] = 1;
            } else if (!matrixClone[i][j] && sum === 3) {
              matrixClone[i][j] = 1;
            } else {
              matrixClone[i][j] = 0;
            }
          }
        }
      });
    });
    setTimeout(runGameofLife, 100);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunState(!isRunning);
          runRef.current = true;
          runGameofLife();
        }}
      >
        {isRunning === false ? "Start Game" : "Stop Game"}
      </button>
      <button
        onClick={() => {
          setMatrix(clearGame());
        }}
      >
        Clear Game
      </button>
      <button
        onClick={() => {
          setMatrix(() => {
            const row = [];
            for (let i = 0; i < rows; i++) {
              row.push(
                Array.from(Array(cols), () => (Math.random() < 0.1 ? 1 : 0))
              );
            }
            return row;
          });
        }}
      >
        Generate Random
      </button>
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 20px)`,
        }}
      >
        {matrix.map((row, r) =>
          row.map((col, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => {
                const updateMatrix = produce(matrix, (matrixClone) => {
                  matrixClone[r][c] = 1 ^ matrixClone[r][c];
                });
                setMatrix(updateMatrix);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: matrix[r][c] === 0 ? "gray" : "yellow",
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
