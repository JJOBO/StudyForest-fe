import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import focusAPI from "./focusAPI";
import FocusTimerDisplay from "./FocusTimerDisplay";
import FocusControls from "./FocusControls";
import "./FocusTimer.scss";

function FocusTimer() {
  const { studyId } = useParams();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");
  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [isEditingSeconds, setIsEditingSeconds] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  const getTargetTime = () => {
    const minutes = parseInt(inputMinutes, 10) || 0;
    const seconds = parseInt(inputSeconds, 10) || 0;
    return minutes * 60 + seconds;
  };

  const updateTimeLeft = () => {
    setTimeLeft(getTargetTime());
  };

  const handleClickStartTimer = async () => {
    if (timeLeft <= 0 && isRunning) return handleClickStopTimer();
    const targetTime = getTargetTime();
    if (targetTime <= 0) return alert("올바른 시간을 입력하세요!");

    try {
      await focusAPI.startFocus(studyId, targetTime);
      setTimeLeft(targetTime);
      setStartTime(Date.now());
      setIsRunning(true);
    } catch (e) {
      console.error("시작 에러:", e);
    }
  };

  const handleClickPauseTimer = () => {
    if (isPaused) {
      setPausedDuration((prev) => prev + (Date.now() - pauseStartTime));
      setPauseStartTime(null);
    } else {
      setPauseStartTime(Date.now());
    }
    setIsPaused((prev) => !prev);
  };

  const handleClickStopTimer = async () => {
    setIsRunning(false);
    let totalPaused = pausedDuration;
    if (isPaused && pauseStartTime) {
      totalPaused += Date.now() - pauseStartTime;
    }

    const elapsed = Math.floor((Date.now() - startTime - totalPaused) / 1000);
    try {
      const res = await focusAPI.stopFocus(studyId, elapsed, timeLeft);
      alert(`${res.focusPoints} 포인트를 획득했습니다!`);
      handleClickResetTimer();
    } catch (e) {
      console.error("중지 에러:", e);
    }
  };

  const handleClickResetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setInputMinutes("");
    setInputSeconds("");
    setPausedDuration(0);
    setPauseStartTime(null);
    setStartTime(null);
    setIsEditingMinutes(false);
    setIsEditingSeconds(false);
  };

  return (
    <div className="timer-wrapper">
      <div className="title">오늘의 집중</div>

      <FocusTimerDisplay
        timeLeft={timeLeft}
        inputMinutes={inputMinutes}
        inputSeconds={inputSeconds}
        isEditingMinutes={isEditingMinutes}
        isEditingSeconds={isEditingSeconds}
        onChangeMinutes={setInputMinutes}
        onChangeSeconds={setInputSeconds}
        onClickMinutes={() => setIsEditingMinutes(true)}
        onClickSeconds={() => setIsEditingSeconds(true)}
        handleBlur={(type) => {
          if (type === "minutes") setIsEditingMinutes(false);
          if (type === "seconds") setIsEditingSeconds(false);
          updateTimeLeft();
        }}
        handleKeyDown={(e, type) => {
          if (e.key === "Enter") {
            if (type === "minutes") setIsEditingMinutes(false);
            if (type === "seconds") setIsEditingSeconds(false);
            updateTimeLeft();
          }
        }}
      />

      <FocusControls
        isRunning={isRunning}
        isPaused={isPaused}
        timeLeft={timeLeft}
        onClickStart={handleClickStartTimer}
        onClickPause={handleClickPauseTimer}
        onClickStop={handleClickStopTimer}
        onClickReset={handleClickResetTimer}
      />
    </div>
  );
}

export default FocusTimer;
