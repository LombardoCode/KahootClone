'use client'

import useInGameStore from "../stores/Kahoot/useInGameStore";
import PlayScreenForHost from "../components/Play/Host/PlayScreenForHost";
import PlayScreenForGuest from "../components/Play/Guest/PlayScreenForGuest";
import useLobbySocketEvents from "../hooks/useLobbySocketEvents";

const GameBlock = () => {
  // Hooks
  useLobbySocketEvents();

  // Global store state
  const { isHost, questionIndex } = useInGameStore();

  return (
    <div key={questionIndex} className={`relative bg-creator-classroom bg-center bg-cover bg-no-repeat h-screen overflow-hidden`}>
      <div className={`absolute inset-0 bg-black ${!isHost ? 'opacity-50' : 'opacity-5'}`}></div>
      <div className="relative z-10 h-full">
        {isHost
          ? <PlayScreenForHost />
          : <PlayScreenForGuest />
        }
      </div>
    </div>
  )
}

export default GameBlock;
