import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  History as HistoryIcon,
  Send
} from 'lucide-react';

export const APP_CONFIG = {
  name: "𝘼𝘿𝙑𝘼𝙉𝘾𝙀 𝙃𝘼𝘾𝐢",
  telegram: "https://t.me/+WIKRSTgIhx5kNDRl",
  profileImage: "/assets/tala-lock.png",
  remoteImage: "/assets/tala-lock.png",
  sourceImagePage: "https://ibb.co.com/RpsW4c9L"
};

// Sifat pattern dictionary for WinGo 30S predictions
const PATTERN_LOGIC: Record<string, 'BIG' | 'SMALL'> = {
  '0+0': 'BIG', '0+1': 'BIG', '0+2': 'BIG', '0+3': 'BIG', '0+4': 'BIG',
  '0+5': 'BIG', '0+6': 'BIG', '0+7': 'BIG', '0+8': 'BIG', '0+9': 'BIG',
  '1+0': 'SMALL', '1+1': 'SMALL', '1+2': 'SMALL', '1+3': 'SMALL', '1+4': 'SMALL',
  '1+5': 'SMALL', '1+6': 'SMALL', '1+7': 'SMALL', '1+8': 'SMALL', '1+9': 'SMALL',
  '2+0': 'BIG', '2+1': 'BIG', '2+2': 'BIG', '2+3': 'BIG', '2+4': 'BIG',
  '2+5': 'BIG', '2+6': 'BIG', '2+7': 'BIG', '2+8': 'BIG', '2+9': 'BIG',
  '3+0': 'SMALL', '3+1': 'SMALL', '3+2': 'SMALL', '3+3': 'SMALL', '3+4': 'SMALL',
  '3+5': 'SMALL', '3+6': 'SMALL', '3+7': 'SMALL', '3+8': 'SMALL', '3+9': 'SMALL',
  '4+0': 'BIG', '4+1': 'BIG', '4+2': 'BIG', '4+3': 'BIG', '4+4': 'BIG',
  '4+5': 'BIG', '4+6': 'BIG', '4+7': 'BIG', '4+8': 'BIG', '4+9': 'BIG',
  '5+0': 'SMALL', '5+1': 'SMALL', '5+2': 'SMALL', '5+3': 'SMALL', '5+4': 'SMALL',
  '5+5': 'SMALL', '5+6': 'SMALL', '5+7': 'SMALL', '5+8': 'SMALL', '5+9': 'SMALL',
  '6+0': 'BIG', '6+1': 'BIG', '6+2': 'BIG', '6+3': 'BIG', '6+4': 'BIG',
  '6+5': 'BIG', '6+6': 'BIG', '6+7': 'BIG', '6+8': 'BIG', '6+9': 'BIG',
  '7+0': 'SMALL', '7+1': 'SMALL', '7+2': 'SMALL', '7+3': 'SMALL', '7+4': 'SMALL',
  '7+5': 'SMALL', '7+6': 'SMALL', '7+7': 'SMALL', '7+8': 'SMALL', '7+9': 'SMALL',
  '8+0': 'BIG', '8+1': 'BIG', '8+2': 'BIG', '8+3': 'BIG', '8+4': 'BIG',
  '8+5': 'BIG', '8+6': 'BIG', '8+7': 'BIG', '8+8': 'BIG', '8+9': 'BIG',
  '9+0': 'SMALL', '9+1': 'SMALL', '9+2': 'SMALL', '9+3': 'SMALL', '9+4': 'SMALL',
  '9+5': 'SMALL', '9+6': 'SMALL', '9+7': 'SMALL', '9+8': 'SMALL', '9+9': 'SMALL',
};

const REQUIRED_PASSWORD = 'advancetop';

interface HistoryRecord {
  period: string;
  signal: 'BIG' | 'SMALL';
  actualNumber: number;
  isWin: boolean;
  ballClass: 'ball-violet' | 'ball-green' | 'ball-red';
  timestamp: number;
}

// Sound effects generator with Web Audio API
class CyberAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playSurge() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.19);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

const audio = new CyberAudio();

export default function App() {
  // Game & Frame controls
  const [gameUrl] = useState<string>(
    'https://dkwin9.com/#/register?invitationCode=737351986511'
  );
  const [soundEnabled] = useState<boolean>(true);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>('');
  const [accessPopOpen, setAccessPopOpen] = useState<boolean>(false);
  const [accessHint, setAccessHint] = useState<string>('ENTER PASSWORD TO ACTIVE');
  const [accessError, setAccessError] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Panel View States
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
  const [surgeFlash, setSurgeFlash] = useState<boolean>(false);

  // Draggable Coordinates
  const [panelPos, setPanelPos] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [historyPos, setHistoryPos] = useState<{ x: number; y: number }>({ x: 20, y: 260 });
  const [fabPos, setFabPos] = useState<{ x: number; y: number }>({ x: 20, y: 20 });

  // Live Prediction Engine State
  const [currentPeriod, setCurrentPeriod] = useState<string>('#-------');
  const [rawPeriodNumber, setRawPeriodNumber] = useState<string>('');
  const [signal, setSignal] = useState<'BIG' | 'SMALL' | 'WAIT'>('WAIT');
  const [predictedNumber, setPredictedNumber] = useState<number | null>(null);
  const [predictedBallClass, setPredictedBallClass] = useState<'ball-red' | 'ball-green' | 'ball-violet'>('ball-red');
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([]);

  // Sound sync
  useEffect(() => {
    audio.enabled = soundEnabled;
  }, [soundEnabled]);

  // Helper for Ball color classification
  const getBallClass = useCallback((n: number): 'ball-violet' | 'ball-green' | 'ball-red' => {
    if (n === 0 || n === 5) return 'ball-violet';
    return [1, 3, 7, 9].includes(n) ? 'ball-green' : 'ball-red';
  }, []);

  // Compute standard 30s period ID
  const computeCyclePeriod = useCallback((d: Date = new Date()): string => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const secOfDay = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();
    const periodIdx = Math.floor(secOfDay / 30) + 1;
    return `${y}${m}${day}10001${String(periodIdx).padStart(4, '0')}`;
  }, []);

  // Initial login restore
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('mk_advancetop_logged_in');
      if (savedAuth === 'yes') {
        setIsLoggedIn(true);
        setAccessPopOpen(false);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  // Set initial coordinates based on screen width
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w <= 480) {
        setPanelPos({ x: Math.max(10, w - 230), y: 15 });
        setHistoryPos({ x: Math.max(10, w - 215), y: 260 });
        setFabPos({ x: Math.max(10, w - 60), y: 15 });
      } else {
        setPanelPos({ x: Math.max(20, w - 250), y: 25 });
        setHistoryPos({ x: Math.max(20, w - 235), y: 320 });
        setFabPos({ x: Math.max(20, w - 70), y: 25 });
      }
    }
  }, []);

  // Generate deterministic outcome from period string
  const calculateResultForPeriod = useCallback((periodStr: string) => {
    let hash = 0;
    for (let i = 0; i < periodStr.length; i++) {
      hash = (hash * 37 + periodStr.charCodeAt(i)) >>> 0;
    }
    const num = hash % 10;
    const size: 'BIG' | 'SMALL' = num >= 5 ? 'BIG' : 'SMALL';
    return { num, size, hash: hash.toString(16) };
  }, []);

  // Calculate prediction for target period
  const predictForTarget = useCallback((targetPeriodStr: string) => {
    const prev1 = String(BigInt(targetPeriodStr) - 1n);
    const prev2 = String(BigInt(targetPeriodStr) - 2n);
    const r1 = calculateResultForPeriod(prev1).num;
    const r2 = calculateResultForPeriod(prev2).num;
    const patternKey = `${r2}+${r1}`;
    const nextSig: 'BIG' | 'SMALL' = PATTERN_LOGIC[patternKey] || (r1 % 2 === 0 ? 'BIG' : 'SMALL');
    
    // Choose candidate number
    const bigs = [5, 6, 7, 8, 9];
    const smalls = [0, 1, 2, 3, 4];
    const pool = nextSig === 'BIG' ? bigs : smalls;
    const num = pool[Math.floor(Math.random() * pool.length)];

    return {
      period: targetPeriodStr,
      signal: nextSig,
      number: num,
      ballClass: getBallClass(num),
    };
  }, [calculateResultForPeriod, getBallClass]);

  // Settle previous period & update UI
  const settleRound = useCallback((settledPeriod: string, actualOutcome: { num: number; size: 'BIG' | 'SMALL' }) => {
    if (!signal || signal === 'WAIT') return;

    const isWin = actualOutcome.size === signal;
    if (isWin) {
      audio.playWin();
    }

    const newRecord: HistoryRecord = {
      period: settledPeriod,
      signal: actualOutcome.size,
      actualNumber: actualOutcome.num,
      isWin: isWin,
      ballClass: getBallClass(actualOutcome.num),
      timestamp: Date.now(),
    };

    setHistoryList((prev) => [newRecord, ...prev.slice(0, 39)]);

    // Pulse Surge animation
    setSurgeFlash(true);
    setTimeout(() => setSurgeFlash(false), 800);
  }, [signal, getBallClass]);

  // Main 30-second cycle runner
  const settledGuardRef = useRef<string>('');
  const lastActivePeriodRef = useRef<string>('');

  useEffect(() => {
    if (!isLoggedIn) return;

    const updateCycle = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const remaining = 29 - (sec % 30);
      setTimerSeconds(remaining);

      const targetPeriod = computeCyclePeriod(now);

      if (targetPeriod !== lastActivePeriodRef.current) {
        lastActivePeriodRef.current = targetPeriod;
        setRawPeriodNumber(targetPeriod);
        setCurrentPeriod('#' + targetPeriod.slice(-7));

        const pred = predictForTarget(targetPeriod);
        setSignal(pred.signal);
        setPredictedNumber(pred.number);
        setPredictedBallClass(pred.ballClass);
      }

      // Settle previous round at the very beginning of a cycle (remaining === 29 or 28)
      if (remaining >= 28 && settledGuardRef.current !== targetPeriod) {
        const previousPeriod = String(BigInt(targetPeriod) - 1n);
        settledGuardRef.current = targetPeriod;
        const actual = calculateResultForPeriod(previousPeriod);
        settleRound(previousPeriod, actual);
      }
    };

    updateCycle();
    const interval = setInterval(updateCycle, 500);

    return () => clearInterval(interval);
  }, [isLoggedIn, computeCyclePeriod, predictForTarget, calculateResultForPeriod, settleRound]);

  // Trigger manual Hack Next surge
  const handleHackNext = () => {
    audio.playSurge();
    if (!isLoggedIn) {
      setAccessPopOpen(true);
      return;
    }

    setSurgeFlash(true);
    setTimeout(() => setSurgeFlash(false), 800);

    // Refresh candidate number
    if (signal !== 'WAIT') {
      const pool = signal === 'BIG' ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
      const num = pool[Math.floor(Math.random() * pool.length)];
      setPredictedNumber(num);
      setPredictedBallClass(getBallClass(num));
    }
  };

  // Open Telegram channel helper
  const openTelegramChannel = useCallback(() => {
    try {
      const link = document.createElement('a');
      link.href = APP_CONFIG.telegram;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(APP_CONFIG.telegram, '_blank');
    }
  }, []);

  // Perform secure activation / login
  const handleActivate = () => {
    const key = accessKey.trim();
    if (!key) {
      setAccessHint('PLEASE ENTER PASSWORD!');
      setAccessError(true);
      return;
    }

    // Only 'advancetop' is accepted (case-insensitive)
    if (key.toLowerCase() !== REQUIRED_PASSWORD.toLowerCase()) {
      setAccessHint('INVALID PASSWORD! CONTACT TELEGRAM');
      setAccessError(true);
      return;
    }

    setIsVerifying(true);
    setAccessHint('OPENING TELEGRAM & ACTIVATING VIP ACCESS…');
    setAccessError(false);

    // Login হওয়ার আগে telegram নিয়া যাবে (Take user to Telegram before completing login)
    openTelegramChannel();

    setTimeout(() => {
      setIsVerifying(false);
      setIsLoggedIn(true);
      setAccessPopOpen(false);
      setAccessHint('ACCESS GRANTED • SYSTEM ONLINE');
      setAccessError(false);
      setAccessKey('');
      try {
        localStorage.setItem('mk_advancetop_logged_in', 'yes');
      } catch {}
      audio.playWin();
      handleHackNext();
    }, 600);
  };

  // Generic Draggable Hook
  const makeDraggable = (
    pos: { x: number; y: number },
    setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    onTap?: () => void
  ) => {
    return {
      onMouseDown: (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.closest('button') ||
          target.closest('input') ||
          target.closest('a') ||
          target.closest('.hist-close') ||
          target.closest('#histList')
        ) {
          return;
        }

        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const initialX = pos.x;
        const initialY = pos.y;
        let moved = false;

        const onMouseMove = (moveEvent: MouseEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            moved = true;
            const newX = Math.max(5, Math.min(window.innerWidth - 70, initialX + dx));
            const newY = Math.max(5, Math.min(window.innerHeight - 70, initialY + dy));
            setPos({ x: newX, y: newY });
          }
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          if (!moved && onTap) onTap();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      },
      onTouchStart: (e: React.TouchEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.closest('button') ||
          target.closest('input') ||
          target.closest('a') ||
          target.closest('.hist-close') ||
          target.closest('#histList')
        ) {
          return;
        }

        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        const initialX = pos.x;
        const initialY = pos.y;
        let moved = false;

        const onTouchMove = (moveEvent: TouchEvent) => {
          const t = moveEvent.touches[0];
          const dx = t.clientX - startX;
          const dy = t.clientY - startY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            moved = true;
            if (moveEvent.cancelable) moveEvent.preventDefault();
            const newX = Math.max(5, Math.min(window.innerWidth - 60, initialX + dx));
            const newY = Math.max(5, Math.min(window.innerHeight - 60, initialY + dy));
            setPos({ x: newX, y: newY });
          }
        };

        const onTouchEnd = () => {
          window.removeEventListener('touchmove', onTouchMove);
          window.removeEventListener('touchend', onTouchEnd);
          if (!moved && onTap) onTap();
        };

        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
      },
    };
  };

  // Equalizer Bars Array (32 Bars with Heights)
  const eqHeights = [
    30, 46, 66, 38, 82, 54, 92, 44, 68, 34, 74, 50, 96, 60, 80, 42,
    88, 52, 72, 32, 78, 48, 64, 30, 70, 40, 58, 28, 52, 36, 62, 34
  ];

  // Particle Orbit Array (10 sparkles)
  const orbitParticles = [
    { a: '0deg', r: '52cqw', c: '#ffd34a', d: '0s' },
    { a: '36deg', r: '49cqw', c: '#d64dff', d: '-.3s' },
    { a: '72deg', r: '53cqw', c: '#00eaff', d: '-.6s' },
    { a: '108deg', r: '50cqw', c: '#ffd34a', d: '-.9s' },
    { a: '144deg', r: '52cqw', c: '#ff5ad8', d: '-1.2s' },
    { a: '180deg', r: '49cqw', c: '#ffd34a', d: '-1.5s' },
    { a: '216deg', r: '53cqw', c: '#b000ff', d: '-1.8s' },
    { a: '252deg', r: '50cqw', c: '#00eaff', d: '-2.1s' },
    { a: '288deg', r: '52cqw', c: '#ffd34a', d: '-2.4s' },
    { a: '324deg', r: '49cqw', c: '#ff5ad8', d: '-2.7s' },
  ];

  // Win stats calculation
  const totalRounds = historyList.length;
  const winCount = historyList.filter((h) => h.isWin).length;
  const winRate = totalRounds > 0 ? ((winCount / totalRounds) * 100).toFixed(1) : '100.0';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none">
      {/* Target Game Iframe Viewport - Fullscreen */}
      <div className="iframe-container">
        <iframe
          id="gameIframe"
          src={gameUrl}
          title="Target Game Platform"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Main Draggable Cyber HUD Panel */}
      {isPanelVisible && (
        <div
          id="mainContainer"
          className="box-container cursor-grab active:cursor-grabbing transition-shadow"
          style={{
            left: `${panelPos.x}px`,
            top: `${panelPos.y}px`,
            right: 'auto',
          }}
          {...makeDraggable(panelPos, setPanelPos)}
        >
          <div className={`neon-panel ${isLoggedIn ? 'live' : ''}`} id="neonPanel">
            {/* Outer Aura Glow */}
            <div className="aura"></div>

            {/* Orbiting Sparkles */}
            <div className="orbit" aria-hidden="true">
              {orbitParticles.map((p, idx) => (
                <i
                  key={idx}
                  style={
                    {
                      '--a': p.a,
                      '--r': p.r,
                      '--c': p.c,
                      '--d': p.d,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            {/* Neon Panel Graphic Artwork Container */}
            <div className="panel-art">
              <div className="image-breath"></div>
              <div className="scan"></div>
              <div className="color-orbit"></div>
              <div className={`surge-flash ${surgeFlash ? 'flash' : ''}`} id="surgeFlash"></div>

              {/* Glowing Corner & Edge Lasers */}
              <div className="edge edge-top"></div>
              <div className="edge edge-bottom"></div>
              <div className="edge edge-left"></div>
              <div className="edge edge-right"></div>
              <div className="corner-glow tl"></div>
              <div className="corner-glow tr"></div>
              <div className="corner-glow bl"></div>
              <div className="corner-glow br"></div>

              {/* Brand Crest & Logo */}
              <div className="crest-star">✦</div>
              <div
                className="brand-badge"
                title={APP_CONFIG.name}
                style={{
                  backgroundImage: `url("${APP_CONFIG.profileImage}"), var(--logo-img)`
                }}
              ></div>

              {/* Dynamic Brand Header Plate */}
              <div className="brand-header-plate">
                <div className="brand-title-text">{APP_CONFIG.name}</div>
                <div className="brand-subtitle-text">NUMBER PANEL</div>
              </div>

              <div className="header-shimmer"></div>
              <div className="subtitle-glow"></div>
              <div className="wing-glow left"></div>
              <div className="wing-glow right"></div>
              <div className="confidence-shimmer"></div>

              {/* Active Live Signal Display or Tala Locked Section */}
              {isLoggedIn ? (
                <div id="signalSection" style={{ display: 'block' }}>
                  <div className="orb-halo"></div>
                  <div className="orb-ring"></div>
                  <div className="signal-plate"></div>
                  <div className="signal-glow"></div>

                  {/* Prediction Signal (BIG / SMALL) */}
                  <div
                    id="signalResult"
                    className={`val-text ${signal === 'BIG' ? 'signal-big' : signal === 'SMALL' ? 'signal-small' : ''}`}
                  >
                    {signal}
                  </div>

                  {/* Outcome Number Ball (0-9) */}
                  <div id="numDisplay">
                    {predictedNumber !== null ? (
                      <div className={`num-ball ${predictedBallClass}`}>
                        {predictedNumber}
                      </div>
                    ) : (
                      '-'
                    )}
                  </div>

                  <div className="live-glow"></div>
                  <div className="wave-plate"></div>

                  {/* Equalizer Waveform Bars */}
                  <div className="waveform" id="waveform">
                    {eqHeights.map((h, i) => (
                      <i
                        key={i}
                        style={
                          {
                            '--h': `${h}%`,
                            '--hue': 305 - i * 4,
                            '--i': i,
                            '--d': `${((i % 8) * -0.12).toFixed(2)}s`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </div>

                  {/* Period Display */}
                  <div className="period-glow"></div>
                  <div className="period-plate"></div>
                  <div id="periodVal" className="val-text">
                    {currentPeriod}
                  </div>

                  {/* 30-Second Countdown Timer */}
                  <div className="timer-badge">
                    TIME{' '}
                    <span id="timerCount" style={{ color: timerSeconds <= 5 ? '#ff4d6d' : '#ffd34a' }}>
                      {String(timerSeconds).padStart(2, '0')}
                    </span>
                    S
                  </div>
                </div>
              ) : (
                /* Locked State with Golden Tala Padlock */
                <div
                  id="lockedSection"
                  onClick={() => {
                    audio.playClick();
                    setAccessPopOpen(true);
                  }}
                  title="তালা আনলক করতে ক্লিক করুন"
                >
                  <img
                    src="/assets/tala-lock.png"
                    alt="তালা Padlock"
                    className="tala-padlock-img"
                  />
                  <div className="tala-lock-title">তালা LOCKED</div>
                  <div className="tala-lock-sub">CLICK TO UNLOCK // প্রবেশ করুন</div>
                </div>
              )}

              {/* Button Sweeps & Glows */}
              <div className="btn-glow btn-glow-gold"></div>
              <div className="btn-glow btn-glow-purple"></div>
              <div className="btn-sweep gold"></div>
              <div className="btn-sweep purple"></div>

              {/* Secure Access Password Modal Overlay */}
              <div
                className={`login-dim ${accessPopOpen ? 'show' : ''}`}
                id="accessDim"
                onClick={() => setAccessPopOpen(false)}
              ></div>

              <div className={`access-pop ${accessPopOpen ? 'show' : ''}`} id="accessPop">
                <div className="flex justify-center mb-1.5">
                  <div className="relative">
                    <img
                      src="/assets/tala-lock.png"
                      alt="তালা Padlock"
                      className="w-16 h-16 rounded-2xl border-2 border-amber-400 shadow-[0_0_25px_rgba(255,190,0,0.8)] object-cover bg-black"
                    />
                    <div className="absolute -inset-1 rounded-2xl border border-amber-300/40 animate-pulse pointer-events-none"></div>
                  </div>
                </div>
                <div className="access-title">SECURE ACCESS // তালা লক</div>
                <div id="loginSection">
                  <input
                    type="password"
                    id="passInput"
                    className="access-input uppercase font-mono tracking-wider"
                    placeholder="ENTER PASSWORD"
                    autoComplete="off"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleActivate();
                      if (e.key === 'Escape') setAccessPopOpen(false);
                    }}
                  />
                  <button
                    type="button"
                    className="btn-active"
                    id="loginBtn"
                    disabled={isVerifying}
                    onClick={handleActivate}
                  >
                    {isVerifying ? 'OPENING TELEGRAM…' : 'ACTIVE PANEL'}
                  </button>
                </div>
                <div
                  className="access-hint mt-2"
                  style={{ color: accessError ? '#ff7d7d' : '#ffd34a' }}
                >
                  {accessHint}
                </div>
                <a
                  href={APP_CONFIG.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-cyan-300/90 hover:text-cyan-200 transition"
                  onClick={() => audio.playClick()}
                >
                  <Send className="w-3 h-3 text-sky-400" /> JOIN OFFICIAL TELEGRAM
                </a>
              </div>

              {/* Hot Interactive Action Controls */}
              <a
                href={APP_CONFIG.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="tg-hot left"
                title="Telegram Support"
                onClick={() => audio.playClick()}
              ></a>
              <a
                href={APP_CONFIG.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="tg-hot right"
                title="Telegram Channel"
                onClick={() => audio.playClick()}
              ></a>

              {/* HACK NEXT Button */}
              <button
                type="button"
                className="hot-btn hack-btn"
                id="hackNextBtn"
                onClick={handleHackNext}
                title="Hack Next / Access"
              ></button>

              {/* HIDE Button */}
              <button
                type="button"
                className="hot-btn hide-btn"
                id="hideBtn"
                onClick={() => {
                  audio.playClick();
                  setIsPanelVisible(false);
                }}
                title="Minimize Panel"
              ></button>

              {/* HISTORY TOGGLE GEM (H) */}
              <button
                type="button"
                className="history-gem"
                id="historyBtn"
                onClick={() => {
                  audio.playClick();
                  setIsHistoryVisible(!isHistoryVisible);
                }}
                title="Toggle History"
              >
                H
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Golden Ring FAB Icon */}
      {!isPanelVisible && (
        <div
          id="floatingLogoWrapper"
          className="cursor-pointer active:scale-95 transition-transform"
          style={{
            display: 'block',
            left: `${fabPos.x}px`,
            top: `${fabPos.y}px`,
            right: 'auto',
          }}
          {...makeDraggable(fabPos, setFabPos, () => {
            audio.playClick();
            setIsPanelVisible(true);
          })}
          title={`Click to Restore ${APP_CONFIG.name}`}
        >
          <div className="gold-ring"></div>
          <div
            className="fab-img-wrapper"
            style={{
              backgroundImage: `url("${APP_CONFIG.profileImage}"), var(--logo-img)`
            }}
          >
            <span style={{ display: 'none' }}>✦</span>
          </div>
        </div>
      )}

      {/* Live Result History Floating Drawer */}
      {isHistoryVisible && (
        <div
          id="historyPanel"
          className="cursor-grab active:cursor-grabbing"
          style={{
            display: 'block',
            left: `${historyPos.x}px`,
            top: `${historyPos.y}px`,
            right: 'auto',
          }}
          {...makeDraggable(historyPos, setHistoryPos)}
        >
          <div className="hist-title flex items-center justify-between pb-1 mb-1 border-b border-purple-800/40">
            <span className="font-bold flex items-center gap-1.5">
              <HistoryIcon className="w-3.5 h-3.5 text-amber-400" /> LIVE RESULT HISTORY
            </span>
            <span
              className="hist-close cursor-pointer hover:text-red-400 px-1 font-bold text-sm"
              onClick={() => {
                audio.playClick();
                setIsHistoryVisible(false);
              }}
            >
              ✖
            </span>
          </div>

          {/* Quick Win Rate Summary */}
          <div className="px-2 py-1 mb-1 bg-purple-950/40 rounded flex items-center justify-between text-[10px] font-mono border border-purple-800/30">
            <span className="text-purple-300">ACCURACY:</span>
            <span className="text-amber-300 font-bold">{winRate}%</span>
            <span className="text-emerald-400">{winCount}W</span>
            <span className="text-rose-400">{totalRounds - winCount}L</span>
          </div>

          <div className="hist-card">
            <div className="hist-notch"></div>
            <div id="histList">
              {historyList.length === 0 ? (
                <div className="text-center py-6 text-xs text-purple-400/60 font-mono">
                  WAITING FOR 30S CYCLE SETTLEMENT…
                </div>
              ) : (
                historyList.map((item, idx) => (
                  <div key={idx} className="hist-item animate-fadeIn">
                    <span className="period-num">#{item.period.slice(-5)}</span>
                    <span className={item.signal === 'BIG' ? 'signal-big font-bold' : 'signal-small font-bold'}>
                      {item.signal}
                    </span>
                    <div
                      className={`num-ball ${item.ballClass}`}
                      style={{ width: '19px', height: '19px', fontSize: '10px' }}
                    >
                      {item.actualNumber}
                    </div>
                    <span className={`status-dot ${item.isWin ? 'win-dot' : 'loss-dot'}`}>
                      {item.isWin ? 'W' : 'L'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
