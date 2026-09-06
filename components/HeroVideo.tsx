"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  mp4Src: string;
  webmSrc?: string;
  poster: string;
}

/**
 * Full-bleed ambient background video for the hero — covers the
 * entire section (not a framed inset), with page content overlaid on
 * top of a dark scrim. This is a deliberately theme-invariant visual
 * moment (fixed dark overlay + white text regardless of light/dark
 * mode) rather than a themed UI panel, matching how full-bleed video
 * heroes conventionally work.
 *
 * Accessibility & resilience:
 * - Respects prefers-reduced-motion: video stays paused on the poster
 *   frame until the person explicitly presses play.
 * - Autoplay is attempted only after mount and only when motion is
 *   allowed; if the browser blocks it anyway, the UI falls back to the
 *   poster + play button rather than showing a blank/frozen frame.
 * - The <video> itself is aria-hidden (decorative footage — the
 *   overlaid headline/copy carry the meaning); play/mute controls are
 *   real, labelled, keyboard-reachable buttons.
 * - The gradient scrim is intentionally strong (not just decorative)
 *   since it's load-bearing for the overlaid white text's contrast
 *   against a moving, unpredictable video background.
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
    <div className="absolute inset-0 w-full h-full overflow-hidden group">
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

      {/* Load-bearing scrim: strongest on the left/bottom where text
          and controls sit, giving white text real contrast margin
          against any frame of the footage, not just a decorative tint. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"
      />

      {/* "In Motion" badge */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container" />
        </span>
        <span className="text-[10px] font-manrope font-bold tracking-widest uppercase text-white">
          In Motion
        </span>
      </div>

      {/* Play/mute controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause showcase video" : "Play showcase video"}
          className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-white text-lg" aria-hidden="true">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute showcase video" : "Mute showcase video"}
          className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-white text-lg" aria-hidden="true">
            {isMuted ? "volume_off" : "volume_up"}
          </span>
        </button>
      </div>
    </div>
  );
}
