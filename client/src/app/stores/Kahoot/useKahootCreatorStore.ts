import { Answer, Kahoot, PointsMultiplier, Question, QuizQuestionLayoutTypes, TimeLimits } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { create } from "zustand";

interface KahootCreatorStore {
  kahoot: Kahoot | null;
  kahootIndex: number;
  isKahootFormDirty: boolean;
  overwriteKahoot: (newKahoot: Kahoot) => void;
  setKahootTitleAndDescription: (kahootInfo: { title: string, description: string }) => void;
  setKahootsQuestionIndex: (index: number) => void;
  selectedQuestion: () => Question | null;
  addQuestion: () => void;
  getKahootQuestions: () => Question[];
  getQuestionCount: () => number;
  updateQuestionTitle: (index: number, newQuestionTitle: string) => void;
  updateAnswerText: (questionIndex: number, answerIndex: number, text: string) => void;
  updateAnswerCorrectness: (questionIndex: number, answerIndex: number, isCorrect: boolean) => void;
  updateQuestionLayout: (questionIndex: number, questionLayout: QuizQuestionLayoutTypes) => void;
  updateQuestionTimeLimit: (questionIndex: number, questionTimeLimit: TimeLimits) => void;
  updateQuestionPoints: (questionIndex: number, questionPoints: PointsMultiplier) => void;
  deleteQuestion: (questionId: number | null) => void;
}

const createNewQuestion = (): Question => {
  let answers: Answer[] = [];

  for (let i = 0; i < 4; i++) {
    answers.push(addNewAnswer());
  }

  return {
    id: 0,
    title: "",
    layout: QuizQuestionLayoutTypes.CLASSIC,
    timeLimit: TimeLimits.THIRTY_S,
    pointsMultiplier: PointsMultiplier.STANDARD,
    mediaUrl: "",
    answers
  }
}

const addNewAnswer = (): Answer => {
  return {
    id: 0,
    text: "",
    isCorrect: false
  }
}

const useKahootCreatorStore = create<KahootCreatorStore>((set, get) => ({
  kahoot: null,
  kahootIndex: 0,
  isKahootFormDirty: false,
  overwriteKahoot: (newKahoot: Kahoot) => set((state) => {
    if (state.kahoot === null) {
      return {
        kahoot: newKahoot,
        kahootIndex: 0
      }
    }

    return state;
  }),
  setKahootTitleAndDescription: ({ title, description }: { title: string, description: string }) => set((state) => {
    if (state.kahoot) {
      return {
        kahoot: {
          ...state.kahoot,
          title,
          description
        }
      }
    }

    return state;
  }),
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
        kahootIndex: newKahootIndex,
        isKahootFormDirty: true
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
      state.isKahootFormDirty = true;
    }
    return { kahoot };
  }),
  updateAnswerText: (questionIndex: number, answerIndex: number, text: string) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      kahoot.questions[questionIndex].answers[answerIndex].text = text;
      state.isKahootFormDirty = true;
    }
    return { kahoot };
  }),
  updateAnswerCorrectness: (questionIndex: number, answerIndex: number, isCorrect: boolean) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      kahoot.questions[questionIndex].answers[answerIndex].isCorrect = isCorrect;
      state.isKahootFormDirty = true;
    }
    return { kahoot };
  }),
  updateQuestionLayout: (questionIndex: number, questionLayout: QuizQuestionLayoutTypes) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot?.questions[questionIndex]) {
      kahoot.questions[questionIndex].layout = questionLayout;
      state.isKahootFormDirty = true;
    }
    return { kahoot };
  }),
  updateQuestionTimeLimit: (questionIndex: number, questionTimeLimit: TimeLimits) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      kahoot.questions[questionIndex].timeLimit = questionTimeLimit;
      state.isKahootFormDirty = true;
    }
    return { kahoot };
  }),
  updateQuestionPoints: (questionIndex: number, questionPoints: PointsMultiplier) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      kahoot.questions[questionIndex].pointsMultiplier = questionPoints;
      state.isKahootFormDirty = true;
    }
    return { kahoot };
  }),
  deleteQuestion: (questionId: number | null) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      // We find the index of the question that we want to remove
      let indexFromQuestionToRemove: number = kahoot.questions.findIndex(q => q.id === questionId);

      // We remove the question
      kahoot.questions = kahoot.questions.filter((_, index) => index !== indexFromQuestionToRemove);

      // And then we reposition the kahootIndex back (eg. if the user is on the last question and then they decide to remove the last question, we will reposition the kahootIndex to the very last question available)
      if (state.kahootIndex >= kahoot.questions.length) {
        state.kahootIndex = kahoot.questions.length - 1;
      }

      return {
        kahoot: {
          ...kahoot,
          questions: [...kahoot.questions]
        },
        kahootIndex: state.kahootIndex
      };
    }

    return state;
  })
}))

export default useKahootCreatorStore;
