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
import { useCoins } from "../context/CoinContext";

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

/* Sticky note map (FIXED) */
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

/* ================= MAIN ================= */

const Studying = () => {
  const { coins, setCoins } = useCoins();

  /* ---------- TIMER STATE ---------- */
  const [seconds, setSeconds] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  const [isRunningStopwatch, setIsRunningStopwatch] = useState(false);
  const [isRunningCountdown, setIsRunningCountdown] = useState(false);

  const [lastInteracted, setLastInteracted] = useState("stopwatch");

  /* ---------- STUDY TRACKING ---------- */
  const [totalStudySeconds, setTotalStudySeconds] = useState(() => {
    const saved = localStorage.getItem("wisora_totalStudySeconds");
    return saved ? Number(saved) : 0;
  });

  const [rewardedSeconds, setRewardedSeconds] = useState(() => {
    const saved = localStorage.getItem("wisora_rewardedSeconds");
    return saved ? Number(saved) : 0;
  });

  /* ---------- COUNTDOWN INPUT ---------- */
  const [isEditingCountdown, setIsEditingCountdown] = useState(false);
  const [countdownInput, setCountdownInput] = useState("00:00:00");
  const countdownInputRef = useRef(null);

  /* ---------- DRAG STATE ---------- */
  const [draggedNote, setDraggedNote] = useState(null);
  const [draggedNoteIndex, setDraggedNoteIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDraggingExistingNote, setIsDraggingExistingNote] = useState(false);
  const [isOverTrashBin, setIsOverTrashBin] = useState(false);

  const studyingRef = useRef(null);
  const audioRef = useRef(new Audio(clickSound));

  const [stickyNotes, setStickyNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("stickyNotes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ================= EFFECTS ================= */

  /* Save study stats */
  useEffect(() => {
    localStorage.setItem("wisora_totalStudySeconds", totalStudySeconds);
    localStorage.setItem("wisora_rewardedSeconds", rewardedSeconds);
  }, [totalStudySeconds, rewardedSeconds]);

  /* Increment study time (FIXED TDZ + isRunning bug) */
  useEffect(() => {
    if (!isRunningStopwatch && !isRunningCountdown) return;
    setTotalStudySeconds((prev) => prev + 1);
  }, [seconds, countdownSeconds, isRunningStopwatch, isRunningCountdown]);

  /* Coin reward */
  useEffect(() => {
    if (totalStudySeconds - rewardedSeconds >= COIN_INTERVAL) {
      setCoins((c) => c + 1);
      setRewardedSeconds((r) => r + COIN_INTERVAL);
    }
  }, [totalStudySeconds, rewardedSeconds, setCoins]);

  /* Stopwatch loop */
  useEffect(() => {
    if (!isRunningStopwatch) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isRunningStopwatch]);

  /* Countdown loop */
  useEffect(() => {
    if (!isRunningCountdown) return;
    const id = setInterval(() => {
      setCountdownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunningCountdown]);

  /* Sticky notes persist */
  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  /* ================= HELPERS ================= */

  const formatTime = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  };

  const parseTime = (str) => {
    const parts = str.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    if (parts[1] > 59 || parts[2] > 59) return null;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  const handleCountdownInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const parsed = parseTime(countdownInput);
      if (parsed !== null) {
        setCountdownSeconds(parsed);
        setIsEditingCountdown(false);
        setIsRunningCountdown(true);
      }
    }
  };

  /* ================= UI ================= */

  return (
    <div ref={studyingRef} className="studying-root">
      <img src={table} draggable={false} />

      {/* CLOCK */}
      <div className="clock">
        <img src={digitalClock} draggable={false} />
        <div className="lcd">
          {isEditingCountdown ? (
            <input
              ref={countdownInputRef}
              value={countdownInput}
              onChange={(e) => setCountdownInput(e.target.value)}
              onKeyDown={handleCountdownInputKeyDown}
            />
          ) : lastInteracted === "stopwatch" ? (
            formatTime(seconds)
          ) : (
            formatTime(countdownSeconds)
          )}
        </div>

        <button onClick={() => setIsRunningStopwatch(true)}>Start</button>
        <button
          onClick={() => {
            setIsEditingCountdown(true);
            setCountdownInput(formatTime(countdownSeconds));
            setLastInteracted("countdown");
          }}
        >
          Set
        </button>
        <button
          onClick={() =>
            lastInteracted === "stopwatch"
              ? setIsRunningStopwatch((p) => !p)
              : setIsRunningCountdown((p) => !p)
          }
        >
          Pause
        </button>
        <button
          onClick={() => {
            setIsRunningStopwatch(false);
            setIsRunningCountdown(false);
            setSeconds(0);
            setCountdownSeconds(0);
          }}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Studying;
