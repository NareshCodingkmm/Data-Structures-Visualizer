import React, { useState } from "react";
import StackVisualizer from "./StackVisualizer";
import QueueVisualizer from "./QueueVisualizer";
import CircularQueueVisualizer from "./CircularQueueVisualizer";
import './Visualizer.css';

function App() {
  const [selected, setSelected] = useState("stack");

  return (
    <div className="app-container">
      {/* Wrap all content except the footer in this <main> tag */}
      <main className="app-content">
        <h1 className="app-title">Data Structures Visualizer - Naresh Kumar Siripurapu</h1>

        <div className="selector">
          <label htmlFor="ds-select" className="dropdown-label">
            Choose Data Structure:
          </label>
          <select
            id="ds-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="stack">Stack</option>
            <option value="queue">Queue</option>
            <option value="circularQueue">Circular Queue</option>
          </select>
        </div>

        <div className="visualizer-wrapper">
          {selected === "stack" && <StackVisualizer />}
          {selected === "queue" && <QueueVisualizer />}
          {selected === "circularQueue" && <CircularQueueVisualizer />}
        </div>
      </main>

      {/* Add this footer at the end */}
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Naresh Kumar Siripurapu. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
export default App;
