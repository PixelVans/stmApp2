import React, { useEffect, useState, useRef } from "react";


export default function Countdown({
  startMinutes = 26,
  title = "Connecting to Secure DB Cluster (Specialised Systems)",
  subtitle = "Requesting elevated permissions [Read Requests] (warping stock table) ,(production table) (stock tables)",
}) {
  const initialSeconds = Math.max(1, Math.floor(startMinutes * 60));
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState([
    { t: 0, text: "Initializing database handshake..." },
    { t: 3, text: "Negotiating credentials with hardware token [nodejs]..." },
    { t: 8, text: "Establishing encrypted channel (TLS 1.3)..." },
    { t: 18, text: "Applying cluster-level policy checks..." },
    { t: 28, text: "Allocating ephemeral compute nodes..." },
    { t: 38, text: "Finalizing permissions — please keep this window open." },
  ]);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const startedAtRef = useRef(Date.now());

  // Reveal staged logs
  useEffect(() => {
    const logTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      const next = logs.filter((l) => l.t <= elapsed && !visibleLogs.includes(l.text));
      if (next.length) {
        setVisibleLogs((v) => [...v, ...next.map((n) => n.text)]);
      }
    }, 700);
    return () => clearInterval(logTimer);
  }, [logs, visibleLogs]);

  // Countdown
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setShowModal(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPaused]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const progress = 1 - remaining / initialSeconds;
  const progressPercent = Math.min(100, Math.max(0, Math.round(progress * 100)));

  const addFive = () => setRemaining((r) => r + 5 * 60);
  const togglePause = () => setIsPaused((p) => !p);

  return (
    <div className="relative max-w-4xl mx-auto p-9 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 rounded-2xl shadow-2xl ring-1 ring-white/5 mt-6">
      <header className="flex items-start gap-4">
        <div className="flex-none w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
          DB
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-slate-300 mt-1">{subtitle}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Estimated time left</div>
          <div className="mt-1 text-2xl font-mono font-semibold">{mm}:{ss}</div>
        </div>
      </header>

      <section className="mt-6">
        <div className="w-full bg-white/6 rounded-lg overflow-hidden h-3">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg,#60a5fa,#a78bfa)" }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
          <span>{progressPercent}% complete</span>
          <span>{remaining === 0 ? "Completed" : `${Math.ceil(remaining / 60)} min remaining`}</span>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={togglePause}
          className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8 text-sm font-medium"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={addFive}
          className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8 text-sm font-medium"
        >
          Sprawl
        </button>
      </section>

      <section className="mt-6 bg-white/3 p-4 rounded-lg font-mono text-sm text-slate-100/90 max-h-72 overflow-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300">Live system log</span>
        </div>
        <div className="space-y-2 min-h-96">
          {visibleLogs.length === 0 && (
            <div className="text-slate-400">Waiting for telemetry...</div>
          )}
          {visibleLogs.map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-xs text-slate-400">[{String(i + 1).padStart(2, "0")}]</div>
              <div className="flex-1">
                <span className="select-text">{l}</span>
                <span className="ml-2 text-slate-500">• {Math.max(0, Math.floor((initialSeconds - remaining) / 5))}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-6 text-center text-xs text-slate-400">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/3">
          <span className="font-semibold">Note:</span>
          <span className="text-xs">Please don’t close the window before the process exits.</span>
        </div>
      </footer>

  {/* Completion Modal */}
     {showModal && (
  <div className="fixed pl-64 inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800">Process Complete</h2>
      <p className="mt-3 text-slate-600">
        Dyestuffs Data Form: <span className="font-bold text-green-600">OK</span>
      </p>
      <p className="mt-3 text-slate-600">
        Insert Node (Server Code): <span className="font-bold text-green-600">OK</span>
      </p>
      <p className="mt-3 text-slate-600">
        Logic (Server Code): <span className="font-bold text-green-600">OK</span>
      </p>
      <p className="mt-3 text-slate-600">
        Logic (Client Code): <span className="font-bold text-green-600">OK</span>
      </p>
      
      <button
        onClick={() =>
          (window.location.href = "http://localhost:5173/update-muster-roll")
        }
        className="mt-6 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md"
      >
        Finish &amp; Test
      </button>
    </div>
  </div>
)}

    </div>
  );
}































// import React, { useEffect, useState, useRef } from "react";

// // PrankCountdown.jsx
// // A single-file React component (Tailwind CSS classes) that simulates a
// // "specialized database / permission / system connection" with an
// // estimated time left of 13 minutes and a live countdown.
// // Default look is playful but believable — use for light-hearted pranks.

// export default function Countdown({
//   startMinutes = 5, 
//   title = "Connecting to Secure DB Cluster (Specialised Systems)",
//   subtitle = "Requesting elevated permissions and warming up pipelines [Form Validations syncing] (WarpingData2025)",
// }) {
//   const initialSeconds = Math.max(1, Math.floor(startMinutes * 60));
//   const [remaining, setRemaining] = useState(initialSeconds);
//   const [isPaused, setIsPaused] = useState(false);
//   const [logs, setLogs] = useState([
//     { t: 0, text: "Initializing database handshake..." },
//     { t: 3, text: "Negotiating credentials with hardware token [nodejs]..." },
//     { t: 8, text: "Establishing encrypted channel (TLS 1.3)..." },
//     { t: 18, text: "Applying cluster-level policy checks..." },
//     { t: 28, text: "Allocating ephemeral compute nodes..." },
//     { t: 38, text: "Finalizing permissions — please keep this window open." },
//   ]);
//   const [visibleLogs, setVisibleLogs] = useState([]);
//   const startedAtRef = useRef(Date.now());

//   // Reveal staged logs as time passes
//   useEffect(() => {
//     const logTimer = setInterval(() => {
//       const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
//       const next = logs.filter((l) => l.t <= elapsed && !visibleLogs.includes(l.text));
//       if (next.length) {
//         setVisibleLogs((v) => [...v, ...next.map((n) => n.text)]);
//       }
//     }, 700);
//     return () => clearInterval(logTimer);
//   }, [logs, visibleLogs]);

//   // Countdown timer
//   useEffect(() => {
//     if (isPaused) return;
//     const id = setInterval(() => {
//       setRemaining((r) => {
//         if (r <= 1) {
//           clearInterval(id);
//           return 0;
//         }
//         return r - 1;
//       });
//     }, 1000);
//     return () => clearInterval(id);
//   }, [isPaused]);

//   // Format mm:ss
//   const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
//   const ss = String(remaining % 60).padStart(2, "0");

//   const progress = 1 - remaining / initialSeconds; // 0 -> 1
//   const progressPercent = Math.min(100, Math.max(0, Math.round(progress * 100)));

//   const addFive = () => setRemaining((r) => r + 5 * 60);
//   const togglePause = () => setIsPaused((p) => !p);

//   return (
//     <div className="max-w-4xl mx-auto p-9 bg-gradient-to-b from-slate-900 to-slate-800
//      text-slate-100 rounded-2xl shadow-2xl ring-1 ring-white/5 mt-6">
//       <header className="flex items-start gap-4">
//         <div className="flex-none w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
//           DB
//         </div>
//         <div className="flex-1">
//           <h1 className="text-lg font-semibold">{title}</h1>
//           <p className="text-sm text-slate-300 mt-1">{subtitle}</p>
//         </div>
//         <div className="text-right">
//           <div className="text-xs text-slate-400">Estimated time left</div>
//           <div className="mt-1 text-2xl font-mono font-semibold">{mm}:{ss}</div>
//         </div>
//       </header>

//       <section className="mt-6">
//         <div className="w-full bg-white/6 rounded-lg overflow-hidden h-3">
//           <div
//             className="h-full transition-all duration-700 ease-out"
//             style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg,#60a5fa,#a78bfa)" }}
//           />
//         </div>
//         <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
//           <span>{progressPercent}% complete</span>
//           <span>{remaining === 0 ? "Completed" : `${Math.ceil(remaining / 60)} min remaining`}</span>
//         </div>
//       </section>

//       <section className="mt-6 grid grid-cols-2 gap-3">
//         <button
//           onClick={togglePause}
//           className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8 text-sm font-medium"
//         >
//           {isPaused ? "Resume" : "Pause"}
//         </button>
//         <button
//           onClick={addFive}
//           className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8 text-sm font-medium"
//         >
//           Sprawl
//         </button>
//       </section>

//       <section className="mt-6 bg-white/3 p-4 rounded-lg font-mono text-sm text-slate-100/90 max-h-72 overflow-auto">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//           <span className="text-xs text-slate-300">Live system log</span>
//         </div>
//         <div className="space-y-2 min-h-96">
//           {visibleLogs.length === 0 && (
//             <div className="text-slate-400">Waiting for telemetry...</div>
//           )}
//           {visibleLogs.map((l, i) => (
//             <div key={i} className="flex items-center gap-3">
//               <div className="text-xs text-slate-400">[{String(i + 1).padStart(2, "0")}]:</div>
//               <div className="flex-1">
//                 <span className="select-text">{l}</span>
//                 <span className="ml-2 text-slate-500">• {Math.max(0, Math.floor((initialSeconds - remaining) / 5))}%</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <footer className="mt-6 text-center text-xs text-slate-400">
//         <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/3">
//           <span className="font-semibold">Note:</span>
//           <span className="text-xs">PLease dont close the window before the process exits.</span>
//         </div>
//       </footer>
//     </div>
//   );
// }


















// Hi TCH Qaunt,
// import React, { useEffect, useState, useRef } from "react";

// // PrankCountdown.jsx
// // Now redesigned to look like a chaotic, alien-tech inspired interface with
// // flashy visuals, glowing logs, and cryptic system information.

// export default function Countdown({
//   startMinutes = 18,
//   title = "[Ξ] Initializing Quantum Mesh Link [Ξ]",
//   subtitle = "Decrypting entangled nodes • Synchronizing warp matrix • Engaging hyperwave protocols",
// }) {
//   const initialSeconds = Math.max(1, Math.floor(startMinutes * 60));
//   const [remaining, setRemaining] = useState(initialSeconds);
//   const [isPaused, setIsPaused] = useState(false);
//   const [logs, setLogs] = useState([
//     { t: 0, text: "⚡ Bootstrapping chrono-core alignment..." },
//     { t: 3, text: "🧬 Infusing qubits with lattice signatures..." },
//     { t: 8, text: "🔮 Establishing phase-shifted neural handshake..." },
//     { t: 18, text: "🌌 Folding spacetime sectors across mesh clusters..." },
//     { t: 28, text: "👁️ Running alien heuristic anomaly scans..." },
//     { t: 38, text: "☢️ Entropy dampeners online. Awaiting final flux sync..." },
//   ]);
//   const [visibleLogs, setVisibleLogs] = useState([]);
//   const startedAtRef = useRef(Date.now());

//   useEffect(() => {
//     const logTimer = setInterval(() => {
//       const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
//       const next = logs.filter((l) => l.t <= elapsed && !visibleLogs.includes(l.text));
//       if (next.length) {
//         setVisibleLogs((v) => [...v, ...next.map((n) => n.text)]);
//       }
//     }, 700);
//     return () => clearInterval(logTimer);
//   }, [logs, visibleLogs]);

//   useEffect(() => {
//     if (isPaused) return;
//     const id = setInterval(() => {
//       setRemaining((r) => {
//         if (r <= 1) {
//           clearInterval(id);
//           return 0;
//         }
//         return r - 1;
//       });
//     }, 1000);
//     return () => clearInterval(id);
//   }, [isPaused]);

//   const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
//   const ss = String(remaining % 60).padStart(2, "0");

//   const progress = 1 - remaining / initialSeconds;
//   const progressPercent = Math.min(100, Math.max(0, Math.round(progress * 100)));

//   const addFive = () => setRemaining((r) => r + 5 * 60);
//   const togglePause = () => setIsPaused((p) => !p);

//   return (
//     <div className="max-w-5xl mx-auto p-10 bg-gradient-to-br from-black via-indigo-950 to-fuchsia-950 text-green-300 rounded-3xl shadow-[0_0_25px_rgba(124,58,237,0.8)] ring-2 ring-fuchsia-500/40 mt-6 animate-pulse-slow">
//       <header className="flex items-start gap-4 animate-pulse">
//         <div className="flex-none w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-indigo-600 flex items-center justify-center text-xl font-extrabold shadow-[0_0_15px_rgba(236,72,153,0.8)]">
//           Ξ
//         </div>
//         <div className="flex-1">
//           <h1 className="text-xl font-bold tracking-wider text-fuchsia-300 drop-shadow-lg">{title}</h1>
//           <p className="text-sm text-indigo-200 mt-1 italic animate-pulse-fast">{subtitle}</p>
//         </div>
//         <div className="text-right">
//           <div className="text-xs text-fuchsia-400">Time anomaly remaining</div>
//           <div className="mt-1 text-3xl font-mono font-semibold text-lime-300 drop-shadow-lg">{mm}:{ss}</div>
//         </div>
//       </header>

//       <section className="mt-8">
//         <div className="w-full bg-black/40 rounded-lg overflow-hidden h-4 shadow-inner">
//           <div
//             className="h-full transition-all duration-500 ease-linear shadow-[0_0_10px_rgba(236,72,153,0.8)]"
//             style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg,#22d3ee,#a855f7,#ec4899)" }}
//           />
//         </div>
//         <div className="flex justify-between items-center mt-2 text-xs text-pink-300 italic">
//           <span>⧉ Flux Sync: {progressPercent}%</span>
//           <span>{remaining === 0 ? "⚠ Collapse Imminent" : `~${Math.ceil(remaining / 60)} min to stabilization`}</span>
//         </div>
//       </section>

//       <section className="mt-6 grid grid-cols-2 gap-3">
//         <button
//           onClick={togglePause}
//           className="px-4 py-2 rounded-lg bg-fuchsia-900/40 hover:bg-fuchsia-700/50 text-sm font-bold tracking-wide shadow-md border border-fuchsia-500/40"
//         >
//           {isPaused ? "Resume Quantum Flux" : "Pause Entanglement"}
//         </button>
//         <button
//           onClick={addFive}
//           className="px-4 py-2 rounded-lg bg-indigo-900/40 hover:bg-indigo-700/50 text-sm font-bold tracking-wide shadow-md border border-indigo-500/40"
//         >
//           Inject +5 Temporal Cycles
//         </button>
//       </section>

//       <section className="mt-8 bg-black/50 p-5 rounded-lg font-mono text-sm text-green-300/90 max-h-80 overflow-auto shadow-inner border border-fuchsia-500/20 animate-glow">
//         <div className="flex items-center gap-2 mb-3">
//           <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
//           <span className="text-xs text-fuchsia-400 uppercase tracking-widest">Ξ Real-Time Xenolog</span>
//         </div>
//         <div className="space-y-2">
//           {visibleLogs.length === 0 && (
//             <div className="text-fuchsia-500 animate-pulse">[ ∅ ] Awaiting alien signal patterns...</div>
//           )}
//           {visibleLogs.map((l, i) => (
//             <div key={i} className="flex items-start gap-3 animate-flicker">
//               <div className="text-xs text-fuchsia-500">[{String(i + 1).padStart(2, "0")}]</div>
//               <div className="flex-1">
//                 <span className="select-text text-green-200">{l}</span>
//                 <span className="ml-2 text-indigo-400">• {Math.max(0, Math.floor((initialSeconds - remaining) / 5))}% sync drift</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <footer className="mt-6 text-center text-xs text-fuchsia-400 animate-pulse-fast">
//         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-900/40 border border-fuchsia-600/40 shadow-lg">
//           <span className="font-semibold">Warning:</span>
//           <span className="text-xs">Unauthorized interference may destabilize the flux continuum.</span>
//         </div>
//       </footer>
//     </div>
//   );
// }
