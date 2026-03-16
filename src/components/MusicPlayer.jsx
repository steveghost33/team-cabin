// ─────────────────────────────────────
//  MusicPlayer.jsx
//  Sticky bottom audio player.
//  Drop your MP3 in the public/ folder
//  and update SONG_FILE and SONG_TITLE below.
// ─────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { C } from '../data/constants';

// ── EDIT THESE ──────────────────────
const SONG_FILE  = '/kylesong.mp3';           // filename in public/ folder
const SONG_TITLE = 'Team Cabin';          // shown in the player
const SONG_SUB   = 'Now Playing';         // subtitle line
// ────────────────────────────────────

export default function MusicPlayer() {
  const audioRef             = useRef(null);
  const progressRef          = useRef(null);
  const [playing, setPlaying]= useState(false);
  const [progress, setProgress]= useState(0);
  const [duration, setDuration]= useState(0);
  const [volume, setVolume]  = useState(0.7);
  const [visible, setVisible]= useState(false);
  const [muted, setMuted]    = useState(false);

  // show player after a short delay so it doesn't
  // blast audio the moment the page loads
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const onTime = () => setProgress(audio.currentTime);
    const onLoad = () => setDuration(audio.duration);
    const onEnd  = () => { setPlaying(false); setProgress(0); };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoad);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoad);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else          { audio.play(); setPlaying(true); }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const seek = (e) => {
    const audio = audioRef.current;
    const bar   = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect  = bar.getBoundingClientRect();
    const pct   = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
    setProgress(pct * duration);
  };

  const changeVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  if (!visible) return null;

  return (
    <>
      <audio ref={audioRef} src={SONG_FILE} preload="metadata" />

      {/* ── sticky player bar ── */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 8000,
        background: `linear-gradient(135deg, ${C.green} 0%, #0a1506 100%)`,
        borderTop: `3px solid ${C.gold}`,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.6)',
        padding: '0.6rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        flexWrap: 'wrap',
      }}>

        {/* song info */}
        <div style={{ minWidth: 120 }}>
          <div style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '0.45rem',
            color: C.goldL,
            letterSpacing: '0.08em',
            marginBottom: '0.2rem',
          }}>{SONG_SUB}</div>
          <div style={{
            fontFamily: '"VT323"',
            fontSize: '1.3rem',
            color: C.cream,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 180,
          }}>{SONG_TITLE}</div>
        </div>

        {/* play/pause */}
        <button onClick={togglePlay} style={{
          fontFamily: '"Press Start 2P"',
          fontSize: '0.9rem',
          background: C.gold,
          color: C.green,
          border: 'none',
          width: 48, height: 48,
          cursor: 'pointer',
          boxShadow: `3px 3px 0 ${C.goldD}`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {playing ? '⏸' : '▶'}
        </button>

        {/* progress bar + times */}
        <div style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontFamily: '"VT323"', fontSize: '1rem', color: C.goldL, flexShrink: 0 }}>
            {fmt(progress)}
          </span>

          {/* clickable progress bar */}
          <div
            ref={progressRef}
            onClick={seek}
            style={{
              flex: 1,
              height: 8,
              background: 'rgba(255,255,255,0.1)',
              border: `1px solid ${C.goldD}`,
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{
              width: `${pct}%`,
              height: '100%',
              background: C.gold,
              transition: 'width 0.25s linear',
            }}/>
          </div>

          <span style={{ fontFamily: '"VT323"', fontSize: '1rem', color: C.goldL, flexShrink: 0 }}>
            {fmt(duration)}
          </span>
        </div>

        {/* mute toggle */}
        <button onClick={toggleMute} style={{
          background: 'none',
          border: 'none',
          color: muted ? '#e74c3c' : C.goldL,
          fontSize: '1.1rem',
          cursor: 'pointer',
          flexShrink: 0,
          padding: '0.25rem',
        }}>
          {muted ? '🔇' : '🔊'}
        </button>

        {/* volume slider */}
        <input
          type="range" min="0" max="1" step="0.05"
          value={volume}
          onChange={changeVolume}
          style={{
            width: 70,
            accentColor: C.gold,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />

        {/* close button */}
        <button onClick={() => {
          audioRef.current?.pause();
          setPlaying(false);
          setVisible(false);
        }} style={{
          background: 'none',
          border: 'none',
          color: 'rgba(245,240,220,0.4)',
          fontSize: '1rem',
          cursor: 'pointer',
          flexShrink: 0,
          padding: '0.25rem',
          marginLeft: 'auto',
        }}>✕</button>

      </div>

      {/* spacer so footer isn't hidden behind the player */}
      <div style={{ height: 72 }} />
    </>
  );
}