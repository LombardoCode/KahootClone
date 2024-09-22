import { QuestionPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { create } from "zustand";

interface InGameStore {
  // Lobby
  lobbyId: string | null;
  setLobbyId: (lobbyId: string) => void;

  // Host variables
  isHost: boolean;
  setIsHost: (isHost: boolean) => void;

  // Identity of the user
  currentPlayer: Player;
  setCurrentPlayer: (newPlayerData: Player) => void;

  // Players
  players: Player[];
  addPlayer: (newPlayer: Player) => void;
  removePlayer: (id: string | null | undefined) => void;

  // Questions
  questions: QuestionPlay[];
  setQuestions: (newQuestions: QuestionPlay[]) => void;
}

interface Player {
  id: string | null | undefined;
  name: string;
}

const useInGameStore = create<InGameStore>()((set, get) => ({
  lobbyId: null,
  setLobbyId: (lobbyId: string) => set(() => ({
    lobbyId
  })),
  isHost: false,
  setIsHost: (isHost: boolean) => set(() => ({
    isHost
  })),
  currentPlayer: { id: '', name: '' },
  setCurrentPlayer: (newPlayerData: Player) => set(() => ({
    currentPlayer: newPlayerData
  })),
  players: [],
  addPlayer: (newPlayer: Player) => set((state) => {
    const existingPlayer = state.players.find(player => player.id === newPlayer.id);

    if (!existingPlayer) {
      return {
        players: [...state.players, newPlayer]
      }
    }

    return state;
  }),
  removePlayer: (id: string | null | undefined) => set((state) => {
    let players = state.players;
    
    if (players) {
      let indexFromPlayerToRemove = players.findIndex(p => p.id === id);
  
      players = players.filter((_, index) => index !== indexFromPlayerToRemove);
  
      return {
        players: [...players]
      }
    }

    return state;
  }),
  questions: [],
  setQuestions: (newQuestions: QuestionPlay[]) => set((state) => {
    let questions = state.questions;

    if (questions) {
      return {
        questions: newQuestions
      }
    }

    return state;
  })
}));

export default useInGameStore;
