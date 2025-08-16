import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Visualizer.css";

const StackVisualizer = () => {
  const [stackSize, setStackSize] = useState(5); // default size 5
  const [stack, setStack] = useState(Array(5).fill(null));
  const [top, setTop] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [log, setLog] = useState([]);
  const [latestIdx, setLatestIdx] = useState(-1);
  const [currentStep, setCurrentStep] = useState(-1);
  const [currentAlgorithm, setCurrentAlgorithm] = useState("push");

  const pushAlgorithmSteps = [
    "Check if the stack is full (top === n-1).",
    "If full, log 'Push failed: Stack Overflow!' and stop.",
    "Prompt the user to enter element.",
    "Increment top by 1.",
    "Insert element into stack at s[top].",
  ];

  const popAlgorithmSteps = [
    "Check if the stack is empty (top === -1).",
    "If empty, log 'Pop failed: Stack Underflow!' and stop.",
    "Retrieve element at top.",
    "Decrement top by 1.",
  ];

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (!isNaN(size) && size > 0) {
      setStackSize(size);
      setStack(Array(size).fill(null));
      setTop(-1);
      setError("");
      setLog([]);
      setLatestIdx(-1);
      setInputValue("");
      setCurrentStep(-1);
    }
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const handlePush = async () => {
    setCurrentAlgorithm("push");
    setCurrentStep(0);
    await sleep(500);

    if (top + 1 >= stackSize) {
      setError("Stack Overflow!");
      const idx = log.length;
      setLog((prev) => [
        ...prev,
        <span key={idx}><span className="removed">Push failed: Stack Overflow!</span></span>,
      ]);
      setLatestIdx(idx);
      setCurrentStep(-1);
      return;
    }

    if (inputValue === "") {
      setError("Enter a value to push!");
      const idx = log.length;
      setLog((prev) => [
        ...prev,
        <span key={idx}><span className="removed">Push failed: No value entered</span></span>,
      ]);
      setLatestIdx(idx);
      setCurrentStep(-1);
      return;
    }

    const newTop = top + 1;
    setTop(newTop);
    const newStack = [...stack];
    newStack[newTop] = inputValue;
    setStack(newStack);

    const idx = log.length;
    setLog((prev) => [
      ...prev,
      <span key={idx}>
        <span className="label">{idx + 1}. </span>
        <span className="value">Push: {inputValue}</span> → Stack: [
        {newStack.map((v, i) => (
          <span key={i} className={v === null ? "null" : "value"}>
            {v ?? "null"}{i < newStack.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </span>,
    ]);
    setLatestIdx(idx);
    setInputValue("");
    setError("");
    setCurrentStep(-1);
  };

  const handlePop = async () => {
    setCurrentAlgorithm("pop");
    setCurrentStep(0);
    await sleep(500);

    if (top === -1) {
      setError("Stack Underflow!");
      const idx = log.length;
      setLog((prev) => [
        ...prev,
        <span key={idx}><span className="removed">Pop failed: Stack Underflow!</span></span>,
      ]);
      setLatestIdx(idx);
      setCurrentStep(-1);
      return;
    }

    const newStack = [...stack];
    const poppedValue = newStack[top];
    newStack[top] = null;
    setStack(newStack);
    setTop(top - 1);

    const idx = log.length;
    setLog((prev) => [
      ...prev,
      <span key={idx}>
        <span className="label">{idx + 1}. </span>
        <span className="removed">Pop: {poppedValue}</span> → Stack: [
        {newStack.map((v, i) => (
          <span key={i} className={v === null ? "null" : "value"}>
            {v ?? "null"}{i < newStack.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </span>,
    ]);
    setLatestIdx(idx);
    setError("");
    setCurrentStep(-1);
  };

  return (
    <div className="visualizer-wrapper">
      <div className="visualization-column">
        <h2>Stack Visualizer</h2>
        <div className="controls">
          <input type="number" placeholder="Stack size" onChange={handleSizeChange} min={1} />
          <input type="text" placeholder="Value to push" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <button onClick={handlePush}>Push</button>
          <button onClick={handlePop}>Pop</button>
        </div>
        {error && <div className="error">{error}</div>}

        <div className="stack-container">
          <div className="stack-indices">
            {stack.map((_, idx) => (
              <div key={idx} className="index-number">
                {idx === top && (
                  <motion.div className="top-variable" layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>Top →</motion.div>
                )}
                {idx}
              </div>
            ))}
            {top === -1 && <div className="index-number"><div className="top-variable">Top → -1</div></div>}
          </div>

          <div className="stack-box">
            <AnimatePresence>
              {stack.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{opacity:0,y:20}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-40}}
                  transition={{duration:0.3}}
                  className={`stack-element ${idx===top?"top-element":""}`}
                >
                  {val ?? ""}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="operations-log">
          <h3>Operations Log</h3>
          <ul>
            {log.map((entry, idx) => (
              <li key={idx} className={idx===latestIdx?"latest":""}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="algorithm-column">
        <h3>Push Algorithm</h3>
        <ol>
          {pushAlgorithmSteps.map((step, idx) => (
            <li key={`push-${idx}`} className={`algorithm-step ${currentAlgorithm==="push"&&idx===currentStep?"active":""}`}>{step}</li>
          ))}
        </ol>
        <h3>Pop Algorithm</h3>
        <ol>
          {popAlgorithmSteps.map((step, idx) => (
            <li key={`pop-${idx}`} className={`algorithm-step ${currentAlgorithm==="pop"&&idx===currentStep?"active":""}`}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default StackVisualizer;
