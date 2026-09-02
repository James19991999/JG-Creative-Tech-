"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  mp4Src: string;
  webmSrc?: string;
  poster: string;
}

/**
 * Circular, ambient background video for the hero. Replaces the static
 * portrait photo with real motion footage while keeping the same
 * aspect-square / rounded-full / whisper-shadow framing the Stitch
 * design used for the photo, so the swap doesn't disturb the layout.
 *
 * Accessibility & resilience:
 * - Respects prefers-reduced-motion: video stays paused on the poster
 *   frame until the person explicitly presses play.
 * - Autoplay is attempted only after mount and only when motion is
 *   allowed; if the browser blocks it anyway, the UI falls back to the
 *   poster + play button rather than showing a blank/frozen frame.
 * - The <video> itself is aria-hidden (it's decorative footage — the
 *   headline and copy already carry the meaning); the play/mute
 *   controls are real, labelled, keyboard-reachable buttons.
 */
export function HeroVideo({ mp4Src, webmSrc, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="aspect-square rounded-full overflow-hidden whisper-shadow relative z-10 ghost-border group">
      <video
        ref={videoRef}
        poster={poster}
        loop
        playsInline
        muted
        preload="metadata"
        aria-hidden="true"
        className="w-full h-full object-cover"
      >
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        <source src={mp4Src} type="video/mp4" />
      </video>

      {/* Brand-tinted vignette so the circular crop reads as an
          intentional frame rather than an accidental clip. */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />

      {/* "In Motion" badge — small creative signal that this is live
          footage, not a static photo. */}
      <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full whisper-shadow">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container" />
        </span>
        <span className="text-[10px] font-manrope font-bold tracking-widest uppercase text-ink">
          In Motion
        </span>
      </div>

      {/* Play/mute controls — glass pill, revealed on hover/focus so it
          doesn't compete with the footage at rest. Always reachable by
          keyboard regardless of hover state. */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause showcase video" : "Play showcase video"}
          className="w-9 h-9 rounded-full bg-surface-container-lowest/95 backdrop-blur flex items-center justify-center whisper-shadow hover:scale-105 active:scale-95 transition-transform"
        >
          <span
            className="material-symbols-outlined text-ink text-lg"
            aria-hidden="true"
          >
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute showcase video" : "Mute showcase video"}
          className="w-9 h-9 rounded-full bg-surface-container-lowest/95 backdrop-blur flex items-center justify-center whisper-shadow hover:scale-105 active:scale-95 transition-transform"
        >
          <span
            className="material-symbols-outlined text-ink text-lg"
            aria-hidden="true"
          >
            {isMuted ? "volume_off" : "volume_up"}
          </span>
        </button>
      </div>
    </div>
  );
}
