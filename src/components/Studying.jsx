import React, { useState, useRef, useEffect } from 'react';
import clickSound from '../assets/click.mp3';
import './Studying.css';

// --- Assets ---
import table from '../assets/table.png';
import stickynote1 from '../assets/stickynote1.png';
import stickynote2 from '../assets/stickynote2.png';
import stickynote3 from '../assets/stickynote3.png';
import stickynote4 from '../assets/stickynote4.png';
import yellowstickynote from '../assets/yellowstickynote.png';
import bluestickynote from '../assets/bluestickynote.png';
import pinkstickynote from '../assets/pinkstickynote.png';
import greenstickynote from '../assets/greenstickynote.png';
import digitalClock from '../assets/digitalClock.png';
import { useCoins } from '../context/CoinContext';

// --- Configuration for Text/Drawing area relative to the 100% note size ---
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

/* Sticky note map (MISSING in Code 1, added from Code 2) */
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

// =======================================================================
// === 1. Studying Component (Main App) ===
// =======================================================================

const Studying = () => {
  const { coins, setCoins } = useCoins();

  /* -------------------- TIMER SYSTEM (Unified State) -------------------- */
  const [seconds, setSeconds] = useState(0); // Stopwatch time
  const [countdownSeconds, setCountdownSeconds] = useState(0); // Countdown time

  const [isRunningStopwatch, setIsRunningStopwatch] = useState(false);
  const [isRunningCountdown, setIsRunningCountdown] = useState(false);

  // inline countdown editor
  const [isEditingCountdown, setIsEditingCountdown] = useState(false);
  const countdownInputRef = useRef(null);
  const [countdownInput, setCountdownInput] = useState("00:00:00");

  // LCD display selection
  const [lastInteracted, setLastInteracted] = useState("stopwatch");

  /* -------------------- STUDY TRACKING (Kept from Code 1 & 2) -------------------- */
  const [totalStudySeconds, setTotalStudySeconds] = useState(() => {
    const saved = localStorage.getItem("wisora_totalStudySeconds");
    return saved ? Number(saved) : 0;
  });
  const [rewardedSeconds, setRewardedSeconds] = useState(() => {
    const saved = localStorage.getItem("wisora_rewardedSeconds");
    return saved ? Number(saved) : 0;
  });

  /* -------------------- STICKY NOTE STATE (Kept from Code 1) -------------------- */
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


  /* ================= EFFECTS (Unified Logic) ================= */

  /* Save all persistence data */
  useEffect(() => {
    localStorage.setItem("wisora_coins", coins);
    localStorage.setItem("wisora_totalStudySeconds", totalStudySeconds);
    localStorage.setItem("wisora_rewardedSeconds", rewardedSeconds);
  }, [coins, totalStudySeconds, rewardedSeconds]);

  /* Save sticky notes */
  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  /* Increment total study time (FIXED: Uses both running states) */
  useEffect(() => {
    if (!isRunningStopwatch && !isRunningCountdown) return;
    setTotalStudySeconds((prev) => prev + 1);
  }, [seconds, countdownSeconds, isRunningStopwatch, isRunningCountdown]);

  /* Coin reward (FIXED: Dependent only on total study time) */
  useEffect(() => {
    if (totalStudySeconds - rewardedSeconds >= COIN_INTERVAL) {
      setCoins((c) => c + 1);
      setRewardedSeconds((r) => r + COIN_INTERVAL);
    }
  }, [totalStudySeconds, rewardedSeconds, setCoins]);


  /* STOPWATCH LOOP (Kept from Code 1/2) */
  useEffect(() => {
    let id;
    if (isRunningStopwatch) {
      id = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(id);
  }, [isRunningStopwatch]);

  /* COUNTDOWN LOOP (Kept from Code 1/2) */
  useEffect(() => {
    let id;
    if (isRunningCountdown) {
      id = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            setIsRunningCountdown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(id);
  }, [isRunningCountdown]);

  /* Focus countdown input */
  useEffect(() => {
    if (isEditingCountdown && countdownInputRef.current) {
      countdownInputRef.current.focus();
      // Optional: setSelectionRange(0, 1) to select the first char
      countdownInputRef.current.setSelectionRange(0, 1);
    }
  }, [isEditingCountdown]);


  /* ================= UTILITY FUNCTIONS ================= */

  const formatTime = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const parseTime = (str) => {
    const parts = str.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    if (parts[1] > 59 || parts[2] > 59) return null;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  /* Logic to handle Enter key in countdown input (Added from Code 2) */
  const handleCountdownInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const parsed = parseTime(countdownInput);
      if (parsed !== null && parsed > 0) { // Only set/start if time is valid and > 0
        setCountdownSeconds(parsed);
        setIsEditingCountdown(false);
        setLastInteracted("countdown"); // Ensure countdown display is primary
        setIsRunningCountdown(true);
      } else if (parsed === 0) {
        setCountdownSeconds(0);
        setIsEditingCountdown(false);
      }
    }
  };

  /* -------------------- TIMER BUTTONS (Unified Logic) -------------------- */

  const handleStart = () => {
    setIsRunningStopwatch(true);
    setIsEditingCountdown(false); // Stop editing if user clicks Start
    setLastInteracted("stopwatch");
  };

  const handleSetCountdown = () => {
    if (!isEditingCountdown) { // Only allow setting if not already editing
      setIsEditingCountdown(true);
      setCountdownInput(formatTime(countdownSeconds));
      setLastInteracted("countdown");
    } else { // If already editing, save it (same as Enter key logic)
      const parsed = parseTime(countdownInput);
      if (parsed !== null && parsed > 0) {
        setCountdownSeconds(parsed);
        setIsEditingCountdown(false);
        setLastInteracted("countdown");
        setIsRunningCountdown(true);
      } else if (parsed === 0) {
        setCountdownSeconds(0);
        setIsEditingCountdown(false);
      }
    }
  };

  const handlePause = () => {
    if (isEditingCountdown) return; // Ignore pause while editing
    if (lastInteracted === "stopwatch") {
      setIsRunningStopwatch((p) => !p);
    } else {
      setIsRunningCountdown((p) => !p);
    }
  };

  const handleStop = () => {
    setIsEditingCountdown(false); // Always stop editing
    if (lastInteracted === "stopwatch") {
      setIsRunningStopwatch(false);
      setSeconds(0);
    } else {
      setIsRunningCountdown(false);
      setCountdownSeconds(0);
    }
  };

  /* ---------------- PRIMARY DISPLAY ---------------- */

  const primaryDisplay = () => {
    if (isEditingCountdown) return countdownInput;
    if (lastInteracted === "stopwatch") return formatTime(seconds);
    return formatTime(countdownSeconds);
  };


  /* ================= DRAG & DROP LOGIC (Kept from Code 1) ================= */

  const getTrashRect = () => ({
    x: TRASH_BIN_DIMENSIONS.left,
    y:
      window.innerHeight -
      TRASH_BIN_DIMENSIONS.bottom -
      TRASH_BIN_DIMENSIONS.height,
    width: TRASH_BIN_DIMENSIONS.width,
    height: TRASH_BIN_DIMENSIONS.height,
  });

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
      const trashRect = getTrashRect();
      const isOver =
        e.clientX > trashRect.x &&
        e.clientX < trashRect.x + trashRect.width &&
        e.clientY > trashRect.y &&
        e.clientY < trashRect.y + trashRect.height;
      setIsOverTrashBin(isOver);
    }
  };

  const handleMouseUp = (e) => {
    if (!draggedNote) return;

    const rect = studyingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const trashRect = getTrashRect();
    const isDroppedOverTrash =
      e.clientX > trashRect.x &&
      e.clientX < trashRect.x + trashRect.width &&
      e.clientY > trashRect.y &&
      e.clientY < trashRect.y + trashRect.height;

    if (isDraggingExistingNote && isDroppedOverTrash) {
      setStickyNotes((prev) => prev.filter((_, i) => i !== draggedNoteIndex));
    } else if (isDraggingExistingNote) {
      setStickyNotes((prev) =>
        prev.map((note, i) =>
          i === draggedNoteIndex ? { ...note, x, y } : note
        )
      );
    } else {
      // Logic for dropping a new note
      if (y > (rect.height * 0.5) && y < (rect.height * 0.9)) { // Simple check to ensure drop is roughly on the desk area
        setStickyNotes((prev) => [
          ...prev,
          { src: draggedNote, x, y, text: "", drawings: [] },
        ]);
      }
    }

    setDraggedNote(null);
    setDraggedNoteIndex(null);
    setIsDraggingExistingNote(false);
    setIsOverTrashBin(false);
  };

  const handleNoteClick = (index, e) => {
    e.stopPropagation();
    if (!draggedNote) {
      setSelectedNoteIndex(index);
      setIsEditorOpen(true);
    }
  };

  const handleSaveNote = (text, drawings) => {
    setStickyNotes((prev) =>
      prev.map((note, i) =>
        i === selectedNoteIndex ? { ...note, text, drawings } : note
      )
    );
    setIsEditorOpen(false);
    setSelectedNoteIndex(null);
  };


  /* -------------------- RENDER SECTION (Kept from Code 1) -------------------- */

  return (
    <div
      ref={studyingRef}
      style={{
        backgroundColor: "#a97c70",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* TABLE */}
      <img
        src={table}
        alt="Study Table"
        style={{
          position: "absolute",
          top: "57%",
          width: "1270px",
          height: "300px",
          zIndex: 10,
        }}
        draggable="false"
      />

      {/* ================== STICKY BUNDLES ================== */}

      <StickyBundle
        src={stickynote1}
        top={58}
        left={140}
        handler={handleMouseDown}
        id="stickynote1"
      />
      <StickyBundle
        src={stickynote2}
        top={64}
        left={86}
        handler={handleMouseDown}
        id="stickynote2"
      />
      <StickyBundle
        src={stickynote3}
        top={64}
        left={190}
        handler={handleMouseDown}
        id="stickynote3"
      />
      <StickyBundle
        src={stickynote4}
        top={70}
        left={135}
        handler={handleMouseDown}
        id="stickynote4"
      />

      {/* ================== CLOCK UNIT ================== */}

      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "70%",
          width: "220px",
          height: "110px",
          zIndex: 50,
        }}
      >
        <img
          src={digitalClock}
          alt="Digital Clock"
          style={{ width: "100%", height: "100%" }}
          draggable="false"
        />

        {/* MAIN LCD DISPLAY */}
        <div
          style={{
            position: "absolute",
            top: "43px",
            left: "27px",
            width: "145px",
            height: "33px",
            color: "#00ff66",
            fontFamily: "monospace",
            fontSize: "30px",
            fontWeight: "700",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            pointerEvents: "none", // input overrides this
          }}
        >
          {isEditingCountdown ? (
            <input
              ref={countdownInputRef}
              value={countdownInput}
              onChange={(e) => setCountdownInput(e.target.value)}
              onKeyDown={handleCountdownInputKeyDown} // Added keydown handler
              style={{
                width: "100%",
                height: "100%",
                fontFamily: "monospace",
                fontSize: "30px",
                fontWeight: "700",
                textAlign: "center",
                background: "transparent",
                border: "none",
                color: "#00ff66",
                outline: "none",
                padding: 0,
                margin: 0,
                pointerEvents: "auto",
              }}
            />
          ) : (
            primaryDisplay()
          )}
        </div>

        {/* BUTTON HITZONES */}
        <button
          onClick={handleStart}
          style={{
            position: "absolute",
            top: 22,
            left: 20,
            width: 45,
            height: 17,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
        <button
          onClick={handleSetCountdown}
          style={{
            position: "absolute",
            top: 22,
            left: 65,
            width: 45,
            height: 17,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
        <button
          onClick={handlePause}
          style={{
            position: "absolute",
            top: 22,
            left: 145,
            width: 35,
            height: 17,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
        <button
          onClick={handleStop}
          style={{
            position: "absolute",
            top: 22,
            left: 105,
            width: 35,
            height: 17,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* DRAG PREVIEW */}
      {draggedNote && (
        <img
          src={draggedNote}
          alt="Dragging Note Preview"
          style={{
            position: "fixed",
            top: mousePos.y - 45,
            left: mousePos.x - 45,
            width: "90px",
            height: "90px",
            pointerEvents: "none",
            opacity: 0.85,
            zIndex: 5000,
          }}
        />
      )}
      
      {/* Trash Bin indicator (Visible when dragging an existing note over it) */}
      {isOverTrashBin && (
        <div
          style={{
            position: "fixed",
            left: TRASH_BIN_DIMENSIONS.left,
            bottom: TRASH_BIN_DIMENSIONS.bottom,
            width: TRASH_BIN_DIMENSIONS.width,
            height: TRASH_BIN_DIMENSIONS.height,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderRadius: '10px',
            pointerEvents: 'none',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          DROP TO DELETE
        </div>
      )}

      {/* RENDER STICKY NOTES */}
      {stickyNotes.map((note, index) => (
        <div
          key={index}
          onMouseDown={(e) => handleMouseDown(null, e, index)}
          onClick={(e) => handleNoteClick(index, e)}
          style={{
            position: "absolute",
            left: note.x - 60,
            top: note.y - 60,
            width: CONTENT_AREA.PREVIEW_SIZE,
            height: CONTENT_AREA.PREVIEW_SIZE,
            cursor: "grab",
            zIndex: 40,
          }}
        >
          <img
            src={note.src}
            alt="Sticky Note"
            style={{ width: "100%", height: "100%", position: "absolute" }}
            draggable="false"
          />

          {note.text && (
            <div
              style={{
                position: "absolute",
                left: 15,
                top: 16,
                width: 80,
                height: 70,
                fontSize: 8,
                overflow: "hidden",
                whiteSpace: "pre-wrap",
              }}
            >
              {note.text}
            </div>
          )}

          {note.drawings?.length > 0 && (
            <StickyNoteDrawing
              drawings={note.drawings}
              position={{
                x: CONTENT_AREA.PREVIEW_LEFT_OFFSET,
                y: CONTENT_AREA.PREVIEW_TOP_OFFSET,
              }}
              size={CONTENT_AREA.PREVIEW_WIDTH}
            />
          )}
        </div>
      ))}

      {/* EDITOR */}
      {isEditorOpen && selectedNoteIndex !== null && (
        <StickyNoteEditor
          note={stickyNotes[selectedNoteIndex]}
          onSave={handleSaveNote}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedNoteIndex(null);
          }}
        />
      )}
    </div>
  );
};

/* ---------------- Sticky Note Bundle ---------------- */

const StickyBundle = ({ src, top, left, handler, id }) => (
  <img
    src={src}
    alt={`Sticky Note Bundle ${id}`}
    onMouseDown={(e) => handler(id, e)}
    style={{
      position: "absolute",
      top: `${top}%`,
      left: `${left}px`,
      width: "90px",
      height: "90px",
      cursor: "grab",
      zIndex: 20,
    }}
    draggable="false"
  />
);

/* ---------------- StickyNoteDrawing ---------------- */

const StickyNoteDrawing = ({ drawings, position, size }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";

    drawings.forEach((drawing) => {
      if (drawing.points.length < 2) return;

      ctx.beginPath();
      // Scale coordinates back up to canvas size for drawing
      ctx.moveTo(
        drawing.points[0].x * canvas.width,
        drawing.points[0].y * canvas.height
      );

      drawing.points.forEach((pt) => {
        ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
      });

      ctx.stroke();
    });
  }, [drawings, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        pointerEvents: "none",
      }}
    />
  );
};

/* ---------------- StickyNoteEditor ---------------- */

const StickyNoteEditor = ({ note, onSave, onClose }) => {
  const [text, setText] = useState(note.text || "");
  const [tool, setTool] = useState("text");
  const [drawing, setDrawing] = useState(false);
  const [drawings, setDrawings] = useState(note.drawings || []);
  const canvasRef = useRef(null);

  const editorSize = 400;
  const canvasSize = Math.round(
    editorSize * (CONTENT_AREA.EDITOR_WIDTH_PERCENT / 100)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4;

    drawings.forEach((d) => {
      if (d.points.length < 2) return;
      ctx.beginPath();
      // Scale coordinates back up to canvas size for drawing
      ctx.moveTo(d.points[0].x * canvas.width, d.points[0].y * canvas.height);
      d.points.forEach((pt) =>
        ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height)
      );
      ctx.stroke();
    });
  }, [drawings]);

  // Function to get relative coordinates (0 to 1)
  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const handleDrawStart = (e) => {
    if (tool !== "pen") return;
    setDrawing(true);
    const { x, y } = getCoords(e);
    setDrawings((prev) => [...prev, { points: [{ x, y }] }]);
  };

  const handleDrawMove = (e) => {
    if (!drawing || tool !== "pen") return;
    const { x, y } = getCoords(e);

    setDrawings((prev) => {
      const updated = [...prev];
      // Check if there's an active drawing to append to
      if (updated.length > 0) {
          updated[updated.length - 1].points.push({ x, y });
      }
      return updated;
    });
  };

  const handleDrawEnd = () => setDrawing(false);

  const clearCanvas = () => setDrawings([]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: editorSize,
          height: editorSize,
        }}
      >
        <img
          src={note.src}
          alt="Sticky Note Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        {/* Toolbar */}
        <div
          style={{
            position: "absolute",
            top: -50,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            background: "white",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <button onClick={() => setTool("pen")} style={{ background: tool === "pen" ? '#ccc' : 'white' }}>✏ Pen</button>
          <button onClick={() => setTool("text")} style={{ background: tool === "text" ? '#ccc' : 'white' }}>📝 Text</button>
          <button
            onClick={clearCanvas}
            style={{ color: "white", background: "red" }}
          >
            🗑 Clear
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            position: "absolute",
            left: `${CONTENT_AREA.EDITOR_LEFT_PERCENT}%`,
            top: `${CONTENT_AREA.EDITOR_TOP_PERCENT}%`,
            width: `${CONTENT_AREA.EDITOR_WIDTH_PERCENT}%`,
            height: `${CONTENT_AREA.EDITOR_HEIGHT_PERCENT}%`,
            background: "transparent",
            border: "none",
            resize: "none",
            fontSize: 20,
            outline: "none",
            zIndex: tool === "text" ? 5 : 3, // Only have high zIndex when editing text
            color: 'black', // Ensure text is visible
            pointerEvents: tool === 'text' ? 'auto' : 'none',
          }}
        />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          onMouseDown={handleDrawStart}
          onMouseMove={handleDrawMove}
          onMouseUp={handleDrawEnd}
          onMouseLeave={handleDrawEnd}
          style={{
            position: "absolute",
            left: `${CONTENT_AREA.EDITOR_LEFT_PERCENT}%`,
            top: `${CONTENT_AREA.EDITOR_TOP_PERCENT}%`,
            width: `${CONTENT_AREA.EDITOR_WIDTH_PERCENT}%`,
            height: `${CONTENT_AREA.EDITOR_HEIGHT_PERCENT}%`,
            zIndex: tool === "pen" ? 5 : 4, // Only have high zIndex when drawing
            cursor: tool === "pen" ? 'crosshair' : 'default',
            pointerEvents: tool === 'pen' ? 'auto' : 'none',
          }}
        />

        {/* Controls */}
        <div
          style={{
            position: "absolute",
            bottom: -50,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onSave(text, drawings)}
            style={{ background: "#007bff", color: "white" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Studying;
