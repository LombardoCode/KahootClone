'use client'

import useInGameStore from "../stores/Kahoot/useInGameStore";

const PlayPage = () => {
  const { currentPlayer, lobbyId, isHost } = useInGameStore();

  return (
    <div>
      <div className="text-3xl font-bold">Play page</div>
      <div id="userdata">
        <p>CurrentPlayer: {JSON.stringify(currentPlayer)}</p>
        <p>LobbyId: {lobbyId}</p>
        <p>IsHost: {isHost ? 'true' : 'false'}</p>
      </div>
    </div>
  )
}

export default PlayPage;
