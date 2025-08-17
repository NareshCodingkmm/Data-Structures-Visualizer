import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./Visualizer.css";

const CircularQueueVisualizer = () => {
  const [queueSize, setQueueSize] = useState(8);
  const [queue, setQueue] = useState(Array(8).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [log, setLog] = useState([]);
  const [latestIdx, setLatestIdx] = useState(-1);
  const [currentStepEnqueue, setCurrentStepEnqueue] = useState(-1);
  const [currentStepDequeue, setCurrentStepDequeue] = useState(-1);

  const logRef = useRef(null);

  const enqueueAlgorithmSteps = [
    "Check if the queue is full ((rear + 1) % n === front).",
    "If full, log 'Enqueue failed: Queue Overflow!' and stop.",
    "Get the element to be inserted from the input field.",
    "Increment rear by 1 (rear = (rear+1) % n).",
    "Insert element at q[rear].",
    "If front === -1, set front = 0.",
  ];

  const dequeueAlgorithmSteps = [
    "Check if the queue is empty (front === -1).",
    "If empty, log 'Dequeue failed: Queue Underflow!' and stop.",
    "Retrieve element at front.",
    "Set q[front] = null.",
    "If front === rear (queue has 1 element), reset front = rear = -1.",
    "Else, increment front by 1 (front = (front+1) % n).",
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

  const handleEnqueue = async () => {
    setCurrentStepEnqueue(-1); 
    await sleep(10);

    for (let i = 0; i < enqueueAlgorithmSteps.length; i++) {
      setCurrentStepEnqueue(i);
      await sleep(600);

      if (i === 0 && (rear + 1) % queueSize === front) {
        setError("Queue Overflow!");
        const idx = log.length;
        setLog((prev) => [
          ...prev,
          <span key={idx}>
            <span className="removed">Enqueue failed: Queue Overflow!</span>
          </span>,
        ]);
        setLatestIdx(idx);
        setCurrentStepEnqueue(-1);
        return;
      }

      if (i === 2 && inputValue === "") {
        setError("Enter a value to enqueue!");
        const idx = log.length;
        setLog((prev) => [
          ...prev,
          <span key={idx}>
            <span className="removed">Enqueue failed: No value entered</span>
          </span>,
        ]);
        setLatestIdx(idx);
        setCurrentStepEnqueue(-1);
        return;
      }
    }

    const newRear = front === -1 ? 0 : (rear + 1) % queueSize;
    const newQueue = [...queue];
    newQueue[newRear] = inputValue;
    if (front === -1) setFront(0);
    setQueue(newQueue);
    setRear(newRear);

    const idx = log.length;
    setLog((prev) => [
      ...prev,
      <span key={idx}>
        <span className="label">{idx + 1}. </span>
        <span className="value">Enqueue: {inputValue}</span> → Queue: [
        {newQueue.map((v, i) => (
          <span key={i} className={v === null ? "null" : "value"}>
            {v ?? "null"}
            {i < newQueue.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </span>,
    ]);
    setLatestIdx(idx);
    setInputValue("");
    setError("");
    setCurrentStepEnqueue(-1);
  };

  const handleDequeue = async () => {
    setCurrentStepDequeue(-1); 
    await sleep(10);

    for (let i = 0; i < dequeueAlgorithmSteps.length; i++) {
      setCurrentStepDequeue(i);
      await sleep(600);

      if (i === 0 && front === -1) {
        setError("Queue Underflow!");
        const idx = log.length;
        setLog((prev) => [
          ...prev,
          <span key={idx}>
            <span className="removed">Dequeue failed: Queue Underflow!</span>
          </span>,
        ]);
        setLatestIdx(idx);
        setCurrentStepDequeue(-1);
        return;
      }
    }

    const newQueue = [...queue];
    const dequeuedValue = newQueue[front];
    newQueue[front] = null;

    let newFront = front;
    let newRear = rear;
    if (front === rear) {
      newFront = -1;
      newRear = -1;
    } else {
      newFront = (front + 1) % queueSize;
    }

    setQueue(newQueue);
    setFront(newFront);
    setRear(newRear);

    const idx = log.length;
    setLog((prev) => [
      ...prev,
      <span key={idx}>
        <span className="label">{idx + 1}. </span>
        <span className="removed">Dequeue: {dequeuedValue}</span> → Queue: [
        {newQueue.map((v, i) => (
          <span key={i} className={v === null ? "null" : "value"}>
            {v ?? "null"}
            {i < newQueue.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </span>,
    ]);
    setLatestIdx(idx);
    setError("");
    setCurrentStepDequeue(-1);
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);
  
  const calculatePointerStyle = (index, type) => {
    if (index === -1) return { opacity: 0, scale: 0 };
    
    const isOverlapped = front !== -1 && front === rear;
    let radius = 190;

    if (isOverlapped) {
      radius = type === 'front' ? 165 : 215;
    }

    const angle = (360 / queueSize) * index;
    const rad = (angle * Math.PI) / 180;
    const containerCenter = 175;
    
    const x = containerCenter + radius * Math.cos(rad);
    const y = containerCenter + radius * Math.sin(rad);
    const rotation = angle + 180;

    return {
      opacity: 1,
      scale: 1,
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    };
  };

  return (
    <>
      <div className="visualization-column">
        <h2>Circular Queue Visualizer</h2>
        <div className="controls">
          <label>Queue Size:</label>
          <input
            type="number"
            placeholder="Queue size"
            value={queueSize}
            onChange={handleSizeChange}
            min={1}
          />
          <label>Value:</label>
          <input
            type="text"
            placeholder="Value to enqueue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleEnqueue}>Enqueue</button>
          <button onClick={handleDequeue}>Dequeue</button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="circular-queue-container">
          {queue.map((val, idx) => {
            const angle = (360 / queueSize) * idx;
            const rad = (angle * Math.PI) / 180;
            const radius = 130;
            const containerCenter = 175;
            const slotSize = 60;
            const x = containerCenter + radius * Math.cos(rad) - (slotSize / 2);
            const y = containerCenter + radius * Math.sin(rad) - (slotSize / 2);

            return (
              <div key={idx} style={{ position: "absolute", left: x, top: y }}>
                <motion.div
                  className={`circular-queue-slot ${idx === front ? "front-element" : ""} ${idx === rear ? "rear-element" : ""}`}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {val ?? ""}
                </motion.div>
                <div className="queue-index">{idx}</div>
              </div>
            );
          })}
          
          {front !== -1 && (
            <>
              <motion.div
                className="circular-pointer front-pointer-cq"
                animate={calculatePointerStyle(front, 'front')}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                Front
              </motion.div>

              <motion.div
                className="circular-pointer rear-pointer-cq"
                animate={calculatePointerStyle(rear, 'rear')}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                Rear
              </motion.div>
            </>
          )}
        </div>

        {front === -1 && (
          <div className="empty-cq-pointers">
            <div className="queue-pointer front-element" style={{ width: '80px', position: 'relative' }}>Front: -1</div>
            <div className="queue-pointer rear-element" style={{ width: '80px', position: 'relative' }}>Rear: -1</div>
          </div>
        )}

        <div className="operations-log">
          <h3>Operations Log</h3>
          <ul ref={logRef}>
            {log.map((entry, idx) => (
              <li key={idx} className={idx === latestIdx ? "latest" : ""}>
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="algorithm-column">
        <h3>Enqueue Algorithm</h3>
        <ol>
          {enqueueAlgorithmSteps.map((step, idx) => (
            <li key={idx} className={`algorithm-step ${idx === currentStepEnqueue ? "active" : ""}`}>
              {step}
            </li>
          ))}
        </ol>

        <h3>Dequeue Algorithm</h3>
        <ol>
          {dequeueAlgorithmSteps.map((step, idx) => (
            <li key={idx} className={`algorithm-step ${idx === currentStepDequeue ? "active" : ""}`}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

export default CircularQueueVisualizer;