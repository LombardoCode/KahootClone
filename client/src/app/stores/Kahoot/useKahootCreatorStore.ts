import { Answer, Kahoot, PointsMultiplier, Question, QuizQuestionLayoutTypes, TimeLimits } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { create } from "zustand";

interface KahootCreatorStore {
  kahoot: Kahoot | null;
  kahootIndex: number;
  setKahootsQuestionIndex: (index: number) => void;
  selectedQuestion: () => Question | null;
  addQuestion: () => void;
  getKahootQuestions: () => Question[];
  getQuestionCount: () => number;
  updateQuestionTitle: (index: number, newQuestionTitle: string) => void;
  updateAnswerText: (questionIndex: number, answerIndex: number, text: string) => void;
  updateAnswerCorrectness: (questionIndex: number, answerIndex: number, isCorrect: boolean) => void;
}

const createInitialKahootCreatorState = (): Kahoot => {
  let kahoot: Kahoot | null = null;
  let newQuestion: Question = createNewQuestion();

  kahoot = {
    id: null,
    questions: [newQuestion]
  }

  return kahoot;
}

const createNewQuestion = (): Question => {
  let answers: Answer[] = [];

  for (let i = 0; i < 4; i++) {
    answers.push(addNewAnswer());
  }

  return {
    id: null,
    title: "",
    layout: QuizQuestionLayoutTypes.CLASSIC,
    timeLimit: TimeLimits.THIRTY_S,
    pointsMultiplier: PointsMultiplier.STANDARD,
    mediaUrl: null,
    answers
  }
}

const addNewAnswer = (): Answer => {
  return {
    id: null,
    text: "",
    isCorrect: false
  }
}

const useKahootCreatorStore = create<KahootCreatorStore>((set, get) => ({
  kahoot: createInitialKahootCreatorState(),
  kahootIndex: 0,
  setKahootsQuestionIndex: (index: number) => set(() => ({
    kahootIndex: index
  })),
  selectedQuestion: () => {
    const state = get();
    return state.kahoot ? state.kahoot.questions[0] : null;
  },
  addQuestion: () => set((state) => {
    if (state.kahoot) {
      const newQuestion = createNewQuestion();
      const updatedQuestions = [...state.kahoot.questions, newQuestion];
      const newKahootIndex = updatedQuestions.length - 1;

      return {
        kahoot: {
          ...state.kahoot,
          questions: updatedQuestions
        },
        kahootIndex: newKahootIndex
      };
    }
    return state;
  }),
  getKahootQuestions: (): Question[] => {
    const state = get();
    return state.kahoot ? state.kahoot.questions : [];
  },
  getQuestionCount: () => {
    const state = get();
    return state.kahoot ? state.kahoot.questions.length : 0;
  },
  updateQuestionTitle: (index: number, newTitle: string) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      kahoot.questions[index].title = newTitle;
    }
    return { kahoot };
  }),
  updateAnswerText: (questionIndex: number, answerIndex: number, text: string) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      kahoot.questions[questionIndex].answers[answerIndex].text = text;
    }
    return { kahoot };
  }),
  updateAnswerCorrectness: (questionIndex: number, answerIndex: number, isCorrect: boolean) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      kahoot.questions[questionIndex].answers[answerIndex].isCorrect = isCorrect;
    }
    return { kahoot };
  })
}))

export default useKahootCreatorStore;
