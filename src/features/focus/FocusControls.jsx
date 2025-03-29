import React from "react";
import "./FocusTimer.scss";

function FocusControls({
  isRunning,
  isPaused,
  timeLeft,
  onClickStart,
  onClickPause,
  onClickStop,
  onClickReset,
}) {
  const hasCompleted = isRunning && timeLeft <= 0;
  const isActive = isRunning && !hasCompleted;

  return (
    <div className="controls">
      {isRunning && timeLeft > 0 && (
        <button
          className="pause-btn"
          onClick={onClickPause}
          aria-label={isPaused ? "resume" : "pause"}
        />
      )}

      <button
        className={`start-btn ${hasCompleted ? "stop" : "start"} ${
          isActive ? "inactive" : ""
        }`}
        onClick={hasCompleted ? onClickStop : onClickStart}
        aria-label={hasCompleted ? "stop" : "start"}
      />

      {isRunning && timeLeft > 0 && (
        <button
          className="reset-btn"
          onClick={onClickReset}
          aria-label="restart"
        />
      )}
    </div>
  );
}

export default FocusControls;
