import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Visualizer.css";

const QueueVisualizer = () => {
  const [queueSize, setQueueSize] = useState(5);
  const [queue, setQueue] = useState(Array(5).fill(null));
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
    "Check if the queue is full (rear === n-1).",
    "If full, log 'Enqueue failed: Queue Overflow!' and stop.",
    "Get the element to be inserted from the input field.",
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
    for (let i = 0; i < enqueueAlgorithmSteps.length; i++) {
      setCurrentStepEnqueue(i);
      await sleep(500);

      if (i === 0 && rear + 1 >= queueSize) {
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

    const newRear = rear + 1;
    const newQueue = [...queue];
    newQueue[newRear] = inputValue;
    setQueue(newQueue);
    if (front === -1) setFront(0);
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
    for (let i = 0; i < dequeueAlgorithmSteps.length; i++) {
      setCurrentStepDequeue(i);
      await sleep(500);

      if (i === 0 && (front === -1 || front > rear)) {
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

    let newFront = front + 1;
    let newRear = rear;
    if (newFront > rear) {
      newFront = -1;
      newRear = -1;
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
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [log]);

  const isOverlapped = front !== -1 && front === rear;

  return (
    <React.Fragment>
      <div className="visualization-column">
        <h2>Queue Visualizer</h2>
        <div className="controls">
          <label>Queue Size:</label>
          <input
            type="number"
            min={1}
            value={queueSize}
            onChange={handleSizeChange}
          />
          <label>Value:</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleEnqueue}>Enqueue</button>
          <button onClick={handleDequeue}>Dequeue</button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="queue-container">
          <div className="queue-box">
            <div className="queue-slots-wrapper">
              {queue.map((val, idx) => (
                <div key={idx} className="queue-slot-container">
                  <AnimatePresence>
                    {val !== null ? (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className={`queue-element ${
                          idx === front ? "front-element" : ""
                        } ${idx === rear ? "rear-element" : ""}`}
                      >
                        {val}
                      </motion.div>
                    ) : (
                      <div className="queue-element" style={{ border: 'none' }}></div>
                    )}
                  </AnimatePresence>
                  <div className="queue-index">
                    {idx}
                  </div>
                </div>
              ))}
              
              <motion.div
                className={`queue-pointer front-element ${front === -1 ? 'empty' : ''} ${isOverlapped ? 'overlapped' : ''}`}
                animate={{
                  left: front === -1
                    ? '10px'
                    : isOverlapped
                      ? `${front * 75 + 2}px`
                      : `${front * 75 + 10}px`,
                  bottom: front === -1 ? '-30px' : '10px'
                }}
                initial={false}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                {front === -1 ? 'Front: -1' : (isOverlapped ? 'F' : 'Front')}
              </motion.div>

              <motion.div
                className={`queue-pointer rear-element ${rear === -1 ? 'empty' : ''} ${isOverlapped ? 'overlapped' : ''}`}
                animate={{
                  left: rear === -1
                    ? '110px'
                    : isOverlapped
                      ? `${rear * 75 + 42}px`
                      : `${rear * 75 + 10}px`,
                  bottom: rear === -1 ? '-30px' : '10px'
                }}
                initial={false}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                {rear === -1 ? 'Rear: -1' : (isOverlapped ? 'R' : 'Rear')}
              </motion.div>
            </div>
          </div>
        </div>

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
    </React.Fragment>
  );
};

export default QueueVisualizer;
