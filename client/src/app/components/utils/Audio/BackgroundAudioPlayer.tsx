import React, { useEffect, useRef } from 'react';

interface BackgroundAudioPlayerProps {
  audio_src: string;
  autoplay: boolean;
  loop: boolean;
}

const BackgroundAudioPlayer = ({ audio_src, autoplay = false, loop = false }: BackgroundAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && autoplay) {
      audioRef.current.play().catch((error) => {
        console.error("Error trying to reproduce the audio:", error);
      });
    }
  }, []);

  return (
    <div>
      <audio ref={audioRef} src={audio_src} autoPlay={autoplay} loop={loop} />
    </div>
  );
};

export default BackgroundAudioPlayer;
