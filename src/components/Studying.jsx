import React, { useState, useRef, useEffect } from "react";
import clickSound from "../assets/click.mp3";
import "./Studying.css";

import table from "../assets/table.png";
import stickynote1 from "../assets/stickynote1.png";
import stickynote2 from "../assets/stickynote2.png";
import stickynote3 from "../assets/stickynote3.png";
import stickynote4 from "../assets/stickynote4.png";
import yellowstickynote from "../assets/yellowstickynote.png";
import bluestickynote from "../assets/bluestickynote.png";
import pinkstickynote from "../assets/pinkstickynote.png";
import greenstickynote from "../assets/greenstickynote.png";
import digitalClock from "../assets/digitalClock.png";

import { useCoins } from "../context/coinContext";

/* ================= CONFIG ================= */

const CONTENT_AREA = {
  EDITOR_LEFT_PERCENT: 15,
  EDITOR_TOP_PERCENT: 15,
  EDITOR_WIDTH_PERCENT: 70,
  EDITOR_HEIGHT_PERCENT: 70,
  PREVIEW_SIZE: 120,
  PREVIEW_LEFT_OFFSET: 18,
  PREVIEW_TOP_OFFSET: 18,
  PREVIEW_WIDTH: 84,
  PREVIEW_HEIGHT: 84,
};

const TRASH_BIN_DIMENSIONS = {
  left: 550,
  bottom: 50,
  width: 150,
  height: 100,
};

const COIN_INTERVAL = 60;

const noteMap = {
  stickynote1,
  stickynote2,
  stickynote3,
  stickynote4,
  yellowstickynote,
  bluestickynote,
  pinkstickynote,
  greenstickynote,
};

/* ================= MAIN COMPONENT ================= */

const Studying = () => {
  const { coins, setCoins } = useCoins();

  /* -------- COIN / STUDY TIME -------- */

  const [totalStudySeconds, setTotalStudySeconds] = useState(() => {
    return Number(localStorage.getItem("wisora_totalStudySeconds")) || 0;
  });

  const [rewardedSeconds, setRewardedSeconds] = useState(() => {
    return Number(localStorage.getItem("wisora_rewardedSeconds")) || 0;
  });

  /* -------- TIMER SYSTEM (SINGLE SOURCE OF TRUTH) -------- */

  const [seconds, setSeconds] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  const [isRunningStopwatch, setIsRunningStopwatch] = useState(false);
  const [isRunningCountdown, setIsRunningCountdown] = useState(false);

  const [lastInteracted, setLastInteracted] = useState("stopwatch");

  const [isEditingCountdown, setIsEditingCountdown] = useState(false);
  const [countdownInput, setCountdownInput] = useState("00:00:00");
  const countdownInputRef = useRef(null);

  /* -------- STICKY NOTES -------- */

  const [stickyNotes, setStickyNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("stickyNotes")) || [];
    } catch {
      return [];
    }
  });

  const [draggedNote, setDraggedNote] = useState(null);
  const [draggedNoteIndex, setDraggedNoteIndex] = useState(null);
  const [isDraggingExistingNote, setIsDraggingExistingNote] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isOverTrashBin, setIsOverTrashBin] = useState(false);

  /* -------- REFS -------- */

  const studyingRef = useRef(null);
  const audioRef = useRef(new Audio(clickSound));

  /* ================= EFFECTS ================= */

  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  useEffect(() => {
    localStorage.setItem("wisora_totalStudySeconds", totalStudySeconds);
    localStorage.setItem("wisora_rewardedSeconds", rewardedSeconds);
    localStorage.setItem("wisora_coins", coins);
  }, [totalStudySeconds, rewardedSeconds, coins]);

  /* Stopwatch loop */
  useEffect(() => {
    if (!isRunningStopwatch) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
      setTotalStudySeconds((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunningStopwatch]);

  /* Countdown loop */
  useEffect(() => {
    if (!isRunningCountdown) return;
    const id = setInterval(() => {
      setCountdownSeconds((p) => {
        if (p <= 1) {
          setIsRunningCountdown(false);
          return 0;
        }
        setTotalStudySeconds((t) => t + 1);
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunningCountdown]);

  /* Coin reward */
  useEffect(() => {
    if (totalStudySeconds - rewardedSeconds >= COIN_INTERVAL) {
      setCoins((c) => c + 1);
      setRewardedSeconds((r) => r + COIN_INTERVAL);
    }
  }, [totalStudySeconds]);

  useEffect(() => {
    if (isEditingCountdown && countdownInputRef.current) {
      countdownInputRef.current.focus();
    }
  }, [isEditingCountdown]);

  /* ================= HELPERS ================= */

  const formatTime = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  };

  const getTrashRect = () => ({
    x: TRASH_BIN_DIMENSIONS.left,
    y:
      window.innerHeight -
      TRASH_BIN_DIMENSIONS.bottom -
      TRASH_BIN_DIMENSIONS.height,
    width: TRASH_BIN_DIMENSIONS.width,
    height: TRASH_BIN_DIMENSIONS.height,
  });

  /* ================= TIMER CONTROLS ================= */

  const handleStart = () => {
    setLastInteracted("stopwatch");
    setIsRunningStopwatch(true);
  };

  const handleSetCountdown = () => {
    setLastInteracted("countdown");
    setIsEditingCountdown(true);
    setCountdownInput(formatTime(countdownSeconds));
  };

  const handlePause = () => {
    if (lastInteracted === "stopwatch") {
      setIsRunningStopwatch((p) => !p);
    } else {
      setIsRunningCountdown((p) => !p);
    }
  };

  const handleStop = () => {
    setIsRunningStopwatch(false);
    setIsRunningCountdown(false);
    setSeconds(0);
    setCountdownSeconds(0);
    setIsEditingCountdown(false);
  };

  const primaryDisplay = () => {
    if (isEditingCountdown) return countdownInput;
    return lastInteracted === "stopwatch"
      ? formatTime(seconds)
      : formatTime(countdownSeconds);
  };

  /* ================= DRAG LOGIC ================= */

  const handleMouseDown = (noteKey, e, index = null) => {
    e.preventDefault();
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } catch {}

    if (index !== null) {
      setDraggedNoteIndex(index);
      setDraggedNote(stickyNotes[index].src);
      setIsDraggingExistingNote(true);
    } else {
      setDraggedNote(noteMap[noteKey]);
      setDraggedNoteIndex(null);
      setIsDraggingExistingNote(false);
    }
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!draggedNote) return;
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDraggingExistingNote) {
      const r = getTrashRect();
      setIsOverTrashBin(
        e.clientX > r.x &&
          e.clientX < r.x + r.width &&
          e.clientY > r.y &&
          e.clientY < r.y + r.height
      );
    }
  };

  const handleMouseUp = (e) => {
    if (!draggedNote) return;

    const rect = studyingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const r = getTrashRect();
    const droppedOverTrash =
      e.clientX > r.x &&
      e.clientX < r.x + r.width &&
      e.clientY > r.y &&
      e.clientY < r.y + r.height;

    if (isDraggingExistingNote && droppedOverTrash) {
      setStickyNotes((p) => p.filter((_, i) => i !== draggedNoteIndex));
    } else if (isDraggingExistingNote) {
      setStickyNotes((p) =>
        p.map((n, i) => (i === draggedNoteIndex ? { ...n, x, y } : n))
      );
    } else {
      setStickyNotes((p) => [...p, { src: draggedNote, x, y, text: "", drawings: [] }]);
    }

    setDraggedNote(null);
    setDraggedNoteIndex(null);
    setIsDraggingExistingNote(false);
    setIsOverTrashBin(false);
  };

  /* ================= RENDER ================= */

  return (
    <div
      ref={studyingRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        backgroundColor: "#a97c70",
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img src={table} style={{ position: "absolute", top: "57%", width: 1270 }} />

      <div style={{ position: "absolute", top: "55%", left: "70%" }}>
        <img src={digitalClock} width={220} />
        <div style={{ color: "#00ff66", fontSize: 30 }}>{primaryDisplay()}</div>

        <button onClick={handleStart} />
        <button onClick={handleSetCountdown} />
        <button onClick={handlePause} />
        <button onClick={handleStop} />
      </div>

      {draggedNote && (
        <img
          src={draggedNote}
          style={{
            position: "fixed",
            left: mousePos.x - 45,
            top: mousePos.y - 45,
            width: 90,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default Studying;
