import { AnswerPlay, KahootPlay, QuestionPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
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
  setKahootInfo: (kahootInfo: KahootPlay) => void;
  questionIndex: number;
  setQuestionIndex: (index: number) => void;

  // Answers
  selectAnswer: (answerId: number | null) => void;
  didUserProvidedAnAnswerToTheQuestion: () => boolean;
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
  setKahootInfo: (kahootInfo: KahootPlay) => set(() => {
    return {
      kahoot: {
        title: kahootInfo.title,
        questions: kahootInfo.questions
      }
    }
  }),
  questionIndex: 0,
  setQuestionIndex: (index: number) => set(() => ({
    questionIndex: index
  })),

  // Answers
  selectAnswer: (answerId: number | null) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      kahoot.questions[state.questionIndex].answers = kahoot.questions[state.questionIndex].answers.map((answer: AnswerPlay) =>
        answer.id === answerId ? { ...answer, isSelected: true } : answer
      )

      return {
        kahoot: {
          ...kahoot
        }
      }
    }
    return state;
  }),
  didUserProvidedAnAnswerToTheQuestion: (): boolean => {
    const state = get();
    const answersFromCurrentQuestion = state.kahoot?.questions[state.questionIndex].answers;
    const theresAtLeastOneAnswerSelected: boolean = answersFromCurrentQuestion?.some((a: AnswerPlay) => a.isSelected === true) || false;
    return theresAtLeastOneAnswerSelected;
  }
}));

export default useInGameStore;
