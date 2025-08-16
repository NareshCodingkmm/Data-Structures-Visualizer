import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Visualizer.css";

const QueueVisualizer = () => {
  const [queueSize, setQueueSize] = useState(5); // default size 5
  const [queue, setQueue] = useState(Array(5).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [log, setLog] = useState([]);
  const [latestIdx, setLatestIdx] = useState(-1);

  // Steps highlighting
  const [currentStepEnqueue, setCurrentStepEnqueue] = useState(-1);
  const [currentStepDequeue, setCurrentStepDequeue] = useState(-1);

  const enqueueAlgorithmSteps = [
    "Check if the queue is full (rear === n-1).",
    "If full, log 'Enqueue failed: Queue Overflow!' and stop.",
    "Prompt the user to enter element.",
    "Increment rear by 1.",
    "Insert element at q[rear].",
    "If front === -1, set front = 0.",
  ];

  const dequeueAlgorithmSteps = [
    "Check if the queue is empty (front === -1 or front > rear).",
    "If empty, log 'Dequeue failed: Queue Underflow!' and stop.",
    "Retrieve element at front.",
    "Set q[front] = null.",
    "Increment front by 1.",
    "If front > rear, reset front = rear = -1.",
  ];

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (!isNaN(size) && size > 0) {
      setQueueSize(size);
      setQueue(Array(size).fill(null));
      setFront(-1);
      setRear(-1);
      setError("");
      setLog([]);
      setLatestIdx(-1);
      setInputValue("");
      setCurrentStepEnqueue(-1);
      setCurrentStepDequeue(-1);
    }
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const handleEnqueue = async () => {
    setCurrentStepEnqueue(0);
    await sleep(500);

    if (rear + 1 >= queueSize) {
      setError("Queue Overflow!");
      const idx = log.length;
      setLog(prev => [
        ...prev,
        <span key={idx}><span className="removed">Enqueue failed: Queue Overflow!</span></span>
      ]);
      setLatestIdx(idx);
      setCurrentStepEnqueue(-1);
      return;
    }

    if (inputValue === "") {
      setError("Enter a value to enqueue!");
      const idx = log.length;
      setLog(prev => [
        ...prev,
        <span key={idx}><span className="removed">Enqueue failed: No value entered</span></span>
      ]);
      setLatestIdx(idx);
      setCurrentStepEnqueue(-1);
      return;
    }

    const newRear = rear + 1;
    const newQueue = [...queue];
    newQueue[newRear] = inputValue;
    setQueue(newQueue);
    if (front === -1) setFront(0);
    setRear(newRear);

    const idx = log.length;
    setLog(prev => [
      ...prev,
      <span key={idx}>
        <span className="label">{idx + 1}. </span>
        <span className="value">Enqueue: {inputValue}</span> → Queue: [
        {newQueue.map((v, i) => (
          <span key={i} className={v === null ? "null" : "value"}>
            {v ?? "null"}{i < newQueue.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </span>
    ]);
    setLatestIdx(idx);
    setInputValue("");
    setError("");
    setCurrentStepEnqueue(-1);
  };

  const handleDequeue = async () => {
    setCurrentStepDequeue(0);
    await sleep(500);

    if (front === -1 || front > rear) {
      setError("Queue Underflow!");
      const idx = log.length;
      setLog(prev => [
        ...prev,
        <span key={idx}><span className="removed">Dequeue failed: Queue Underflow!</span></span>
      ]);
      setLatestIdx(idx);
      setCurrentStepDequeue(-1);
      return;
    }

    const newQueue = [...queue];
    const dequeuedValue = newQueue[front];
    newQueue[front] = null;
    setQueue(newQueue);

    let newFront = front + 1;
    if (newFront > rear) {
      newFront = -1;
      setRear(-1);
    }
    setFront(newFront);

    const idx = log.length;
    setLog(prev => [
      ...prev,
      <span key={idx}>
        <span className="label">{idx + 1}. </span>
        <span className="removed">Dequeue: {dequeuedValue}</span> → Queue: [
        {newQueue.map((v, i) => (
          <span key={i} className={v === null ? "null" : "value"}>
            {v ?? "null"}{i < newQueue.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </span>
    ]);
    setLatestIdx(idx);
    setError("");
    setCurrentStepDequeue(-1);
  };

  return (
    <div className="visualizer-wrapper">
      <div className="visualization-column">
        <h2>Queue Visualizer</h2>

        <div className="controls">
          <input type="number" placeholder="Queue size" onChange={handleSizeChange} min={1} />
          <input type="text" placeholder="Value to enqueue" value={inputValue} onChange={e => setInputValue(e.target.value)} />
          <button onClick={handleEnqueue}>Enqueue</button>
          <button onClick={handleDequeue}>Dequeue</button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="queue-container">
          {queue.map((val, idx) => (
            <div key={idx} className="queue-slot-container">
              <AnimatePresence>
                {val !== null ? (
                  <motion.div
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -120, opacity: 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
                    className={`queue-element ${idx === front ? "front-element" : ""} ${idx === rear ? "rear-element" : ""}`}
                  >
                    {val}
                  </motion.div>
                ) : (
                  <div className="queue-element empty-slot"></div>
                )}
              </AnimatePresence>
              <div className="queue-index">
                {idx}
                {idx === front && <motion.div className="front-pointer">↑<br />Front</motion.div>}
                {idx === rear && <motion.div className="rear-pointer">↑<br />Rear</motion.div>}
              </div>
            </div>
          ))}
        </div>

        {front === -1 && rear === -1 && (
          <div className="front-rear">
            <motion.div className="front-pointer">↑<br />Front -1</motion.div>
            &nbsp;&nbsp;
            <motion.div className="rear-pointer">↑<br />Rear -1</motion.div>
          </div>
        )}

        <div className="operations-log">
          <h3>Operations Log</h3>
          <ul>
            {log.map((entry, idx) => (
              <li key={idx} className={idx === latestIdx ? "latest" : ""}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="algorithm-column">
        <h3>Enqueue Algorithm</h3>
        <ol>
          {enqueueAlgorithmSteps.map((step, idx) => (
            <li key={idx} className={idx === currentStepEnqueue ? "active" : ""}>{step}</li>
          ))}
        </ol>
        <h3>Dequeue Algorithm</h3>
        <ol>
          {dequeueAlgorithmSteps.map((step, idx) => (
            <li key={idx} className={idx === currentStepDequeue ? "active" : ""}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default QueueVisualizer;
