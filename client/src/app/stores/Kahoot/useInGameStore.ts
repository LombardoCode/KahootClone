import { AnswerPlay, KahootPlay, PointsMultiplier, QuestionPlay } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { debugLog } from "@/app/utils/debugLog";
import { HubConnectionState } from "@microsoft/signalr";
import { create } from "zustand";

interface InGameStore {
  // Crucial gameplay actions
  terminateGameSession: () => Promise<void>;


  // SignalR connection
  signalRConnection: signalR.HubConnection | null;
  setSignalRConnection: (connection: signalR.HubConnection | null) => void;

  // Lobby
  lobbyId: string | null;
  setLobbyId: (lobbyId: string | null) => void;


  // Host variables
  isHost: boolean | null;
  setIsHost: (isHost: boolean | null) => void;


  // Identity of the user
  currentPlayer: Player | null;
  setCurrentPlayer: (newPlayerData: Player | null) => void;


  // Players
  players: Player[];
  addPlayer: (newPlayer: Player) => void;
  removePlayer: (id: string | null | undefined) => void;
  addPointsToThePlayer: (playerConnId: string, selectedAnswerIdFromGuest: number, timeLeftInSecs: number | undefined) => void;
  earnedPointsFromCurrentQuestion: number;
  setEarnedPointsFromCurrentQuestion: (earnedPointsFromCurrentQuestion: number) => void;
  finalPlayerStats: FinalPlayerStats[];
  setFinalPlayerStats: (finalPlayerStats: Player[]) => void;
  everyoneHasAnsweredTheCurrentQuestion: boolean,
  setEveryoneHasAnsweredTheCurrentQuestion: (status: boolean) => void;
  finalPlayerData: FinalPlayerStats | null;
  setFinalPlayerData: (finalPlayerData: FinalPlayerStats | null) => void;
  showPlayerFinalStats: boolean;
  setShowPlayerFinalStats: (value: boolean) => void;


  // Kahoot and questions
  kahoot: KahootPlay | null;
  setKahoot: (kahootInfo: KahootPlay | null) => void;
  questionIndex: number;
  setQuestionIndex: (index: number) => void;
  goToTheNextQuestion: () => void;
  isThisTheLastQuestion: () => boolean;
  countOfAnswersProvidedByGuests: number;
  setCountOfAnswersProvidedByGuests: (count: number) => void;
  remainingTime: number;
  setRemainingTime: (remainingTime: number) => void;


  // Answers
  selectAnswer: (answerId: number | null) => void;
  didUserProvidedAnAnswerToTheQuestion: () => boolean;
  answerStatsForCurrentQuestion: AnswerStatsForCurrentQuestion[] | null;
  setAnswerStatsForCurrentQuestion: (stats: AnswerStatsForCurrentQuestion[] | null) => void;
  increaseAnswerCountForCurrentQuestion: (answerId: number) => void;
}

interface Player {
  connectionId: string | null | undefined;
  userId: string | null;
  name: string;
  earnedPoints: number;
}

export interface FinalPlayerStats extends Player {
  place: number;
}

export interface AnswerStatsForCurrentQuestion {
  answerId: number;
  isCorrect: boolean;
  quantityOfTimesSelected: number;
};

const useInGameStore = create<InGameStore>()((set, get) => ({
  // Crucial gameplay actions
  terminateGameSession: async () => {
    const state = get();
    const connection = state.signalRConnection;

    try {
      if (connection !== null && connection.state === HubConnectionState.Connected) {
        await connection.stop();
      }
    } catch {
      //
    }
    finally {
      // Clean every single variable that we used during gameplay process
      debugLog("Cleaning every single variable from gameplay");

      set({
        // The SignalR connection
        signalRConnection: null,

        // LobbyId
        lobbyId: null,

        // Host / Guest indicator
        isHost: null,
        
        // Current player information
        currentPlayer: null,
        
        // The players array
        players: [],
        
        // Earned points
        earnedPointsFromCurrentQuestion: 0,
        
        // Final players statistics
        finalPlayerStats: [],
        
        // Indicator to check if everyone has answered the current question
        everyoneHasAnsweredTheCurrentQuestion: false,
        
        // Current player's final statistics
        finalPlayerData: null,
        
        // Indicator to show players' final statistics
        showPlayerFinalStats: false,
        
        // The kahoot that was played
        kahoot: null,
        
        // Current question holder
        questionIndex: 0,
        
        // Number of provided answers by guests on current question
        countOfAnswersProvidedByGuests: 0,
        
        // Current question's remaining time
        remainingTime: 0,
        
        // Current question's answers statistics
        answerStatsForCurrentQuestion: null
      });
    }
  },

  // SignalR connection
  signalRConnection: null,
  setSignalRConnection: (connection: signalR.HubConnection | null) => set(() => ({
    signalRConnection: connection
  })),

  // Lobby
  lobbyId: null,
  setLobbyId: (lobbyId: string | null) => set(() => ({
    lobbyId
  })),

  // Host variables
  isHost: null,
  setIsHost: (isHost: boolean | null) => set(() => ({
    isHost
  })),

  // Identity of the user
  currentPlayer: null,
  setCurrentPlayer: (newPlayerData: Player | null) => set(() => ({
    currentPlayer: newPlayerData
  })),

  // Players
  players: [],
  addPlayer: (newPlayer: Player) => set((state) => {
    const existingPlayer = state.players.find(player => player.connectionId === newPlayer.connectionId);

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
      let indexFromPlayerToRemove = players.findIndex(p => p.connectionId === id);

      players = players.filter((_, index) => index !== indexFromPlayerToRemove);

      return {
        players: [...players]
      }
    }

    return state;
  }),
  addPointsToThePlayer: (playerConnId: string, selectedAnswerIdFromGuest: number, timeLeftInSecs: number | undefined) => set((state) => {
    if (state.kahoot) {
      // Determine the current question and check if the user answered correctly
      const currentQuestion: QuestionPlay = state.kahoot.questions[state.questionIndex];
      const correctAnswerIdFromCurrentQuestion: AnswerPlay[] | undefined = currentQuestion.answers.filter(a => a.isCorrect);
      const selectedAnswerIdFromCurrentQuestion: AnswerPlay | undefined = currentQuestion.answers.find(a => a.id === selectedAnswerIdFromGuest);

      if (correctAnswerIdFromCurrentQuestion.some(correctAnswer => correctAnswer.id === selectedAnswerIdFromCurrentQuestion?.id)) {
        // Calculate the total of points that we are going to give to the player
        const pointsBase: number = 10;
        const quantityOfSecondsLeftWhenPlayerAnswered: number = timeLeftInSecs != null ? timeLeftInSecs : 30;
        const pointsMultiplier: PointsMultiplier = currentQuestion.pointsMultiplier;
        const totalPointsToGive: number = pointsBase * quantityOfSecondsLeftWhenPlayerAnswered * pointsMultiplier;

        // Then update the player's info (host-side)
        let updatedPlayers: Player[] = state.players.map((player: Player) => {
          if (player.connectionId === playerConnId) {
            return {
              ...player,
              earnedPoints: player.earnedPoints + totalPointsToGive
            }
          }
          return player;
        });

        // Send the updated player info to the target player
        const updatedPlayerInfo = updatedPlayers.find(p => p.connectionId === playerConnId);
        state.signalRConnection?.invoke('UpdatePlayerInfo', updatedPlayerInfo);
        state.signalRConnection?.invoke('NotifyPlayerHowManyPointsTheyGotFromCurrentQuestion', playerConnId, totalPointsToGive);

        return {
          players: updatedPlayers
        };
      }
    }

    return state;
  }),
  earnedPointsFromCurrentQuestion: 0,
  setEarnedPointsFromCurrentQuestion: (earnedPointsFromCurrentQuestion: number) => set(() => ({ earnedPointsFromCurrentQuestion })),
  setFinalPlayerStats: (playerStats: Player[]) => set((state) => {
    let playersStatsOrganizedByEarnedPoints = playerStats.sort((a, b) => b.earnedPoints - a.earnedPoints);
    let finalPlayerStats: FinalPlayerStats[] = playersStatsOrganizedByEarnedPoints.map((player: Player, index: number) => {
      let finalPlayerStat: FinalPlayerStats = {
        connectionId: player.connectionId,
        userId: null,
        name: player.name,
        earnedPoints: player.earnedPoints,
        place: index + 1
      }

      return finalPlayerStat;
    });

    return {
      finalPlayerStats
    }
  }),
  finalPlayerStats: [],
  everyoneHasAnsweredTheCurrentQuestion: false,
  setEveryoneHasAnsweredTheCurrentQuestion: (status: boolean) => set(() => ({
    everyoneHasAnsweredTheCurrentQuestion: status
  })),
  finalPlayerData: null,
  setFinalPlayerData: (finalPlayerData: FinalPlayerStats | null) => set(() => ({
    finalPlayerData
  })),
  showPlayerFinalStats: false,
  setShowPlayerFinalStats: (value: boolean) => set(() => ({
    showPlayerFinalStats: value
  })),

  // Kahoot and questions
  kahoot: null,
  setKahoot: (kahootInfo: KahootPlay | null) => set(() => ({
    kahoot: kahootInfo
  })),
  questionIndex: 0,
  setQuestionIndex: (index: number) => set(() => ({
    questionIndex: index
  })),
  goToTheNextQuestion: () => set((state) => {
    if (state.kahoot) {
      // If we still have pending questions to play...
      if (!state.isThisTheLastQuestion()) {
        const newQuestionIndex: number = state.questionIndex + 1;
        // Send the guests to the '/getready' page
        if (state.signalRConnection) {
          state.signalRConnection.invoke('StartRound', state.lobbyId, newQuestionIndex);
        }
        
        return {
          questionIndex: newQuestionIndex
        }
      } else {
        // If we run out of questions to play, send the guests to the '/ranking' page
        state.signalRConnection?.invoke('RedirectGuestsFromLobbyToSpecificPage', state.lobbyId, '/ranking');
      }
    }
    return state;
  }),
  isThisTheLastQuestion: (): boolean => {
    const state = get();

    if (!state.kahoot) {
      return false;
    }

    const totalNumberOfQuestionsFromKahoot = state.kahoot.questions.length;

    return (state.questionIndex) === (totalNumberOfQuestionsFromKahoot - 1);
  },
  countOfAnswersProvidedByGuests: 0,
  setCountOfAnswersProvidedByGuests: (count: number) => set(() => ({
    countOfAnswersProvidedByGuests: count
  })),
  remainingTime: 0,
  setRemainingTime: (remainingTime: number) => set(() => ({
    remainingTime
  })),

  // Answers
  selectAnswer: (answerId: number | null) => set((state) => {
    const kahoot = state.kahoot;

    if (kahoot) {
      const currentQuestion: QuestionPlay = kahoot.questions[state.questionIndex];

      // Update the answer's "isSelected" property
      const updatedAnswers = currentQuestion.answers.map((answer: AnswerPlay) => answer.id === answerId
        ? { ...answer, isSelected: true }
        : { ...answer, isSelected: false }
      );

      const updatedQuestion: QuestionPlay = { ...currentQuestion, answers: updatedAnswers };

      kahoot.questions[state.questionIndex] = updatedQuestion;

      if (state.signalRConnection) {
        state.signalRConnection.invoke('NotifyAnswerReceived', state.lobbyId, currentQuestion.id, answerId);
      }

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
    const currentQuestion: QuestionPlay | undefined = state.kahoot?.questions[state.questionIndex];
    const answersFromCurrentQuestion = currentQuestion?.answers;
    const theresAtLeastOneAnswerSelected: boolean = answersFromCurrentQuestion?.some((a: AnswerPlay) => a.isSelected === true) || false;
    return theresAtLeastOneAnswerSelected;
  },
  answerStatsForCurrentQuestion: null,
  setAnswerStatsForCurrentQuestion: (stats: AnswerStatsForCurrentQuestion[] | null): void => {
    set({
      answerStatsForCurrentQuestion: stats
    })
  },
  increaseAnswerCountForCurrentQuestion: (answerId: number) => set((state) => {
    if (state.answerStatsForCurrentQuestion) {
      // Find the answer that we can to increase its counter (number of times that was selected by the guests)
      let answerToUpdate = state.answerStatsForCurrentQuestion.find(a => a.answerId === answerId);

      if (answerToUpdate) {
        answerToUpdate.quantityOfTimesSelected += 1;
      }
    }

    return {
      answerStatsForCurrentQuestion: state.answerStatsForCurrentQuestion
    };
  })
}));

export default useInGameStore;
