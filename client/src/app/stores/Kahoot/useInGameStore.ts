import { KahootPlay, QuestionPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { create } from "zustand";

interface InGameStore {
  // SignalR connection
  signalRConnection: signalR.HubConnection | null;
  setSignalRConnection: (connection: signalR.HubConnection) => void;

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

  // Kahoot and questions
  kahoot: KahootPlay | null;
  setQuestions: (newQuestions: QuestionPlay[]) => void;
  questionIndex: number;
  setQuestionIndex: (index: number) => void;
}

interface Player {
  id: string | null | undefined;
  name: string;
}

const useInGameStore = create<InGameStore>()((set, get) => ({
  // SignalR connection
  signalRConnection: null,
  setSignalRConnection: (connection: signalR.HubConnection) => set(() => ({
    signalRConnection: connection
  })),

  // Lobby
  lobbyId: null,
  setLobbyId: (lobbyId: string) => set(() => ({
    lobbyId
  })),

  // Host variables
  isHost: false,
  setIsHost: (isHost: boolean) => set(() => ({
    isHost
  })),

  // Identity of the user
  currentPlayer: { id: '', name: '' },
  setCurrentPlayer: (newPlayerData: Player) => set(() => ({
    currentPlayer: newPlayerData
  })),

  // Players
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
  
  // Kahoot and questions
  kahoot: null,
  setQuestions: (newQuestions: QuestionPlay[]) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      let questions = kahoot.questions;
  
      if (questions) {
        return {
          kahoot: {
            ...kahoot,
            questions: newQuestions
          }
        }
      }
    }

    return state;
  }),
  questionIndex: 0,
  setQuestionIndex: (index: number) => set(() => ({
    questionIndex: index
  }))
}));

export default useInGameStore;
