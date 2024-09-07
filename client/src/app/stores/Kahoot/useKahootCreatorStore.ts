import { KahootHeaderInfo } from "@/app/interfaces/Creator/KahootHeaderInfo.interface";
import { Answer, Kahoot, PointsMultiplier, Question, QuizQuestionLayoutTypes, TimeLimits } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { create } from "zustand";

interface KahootValidationStatus {
  isPlayable: boolean;
  questions: KahootQuestionValidation[]
}

export interface KahootQuestionValidation {
  kahootIndex: number;
  errors: {
    questionTitle: string;
    missingAnswerTitles: string;
    answerCorrectness: string;
  }
}

interface KahootCreatorStore {
  kahoot: Kahoot | null;
  kahootIndex: number;
  isKahootFormDirty: boolean;
  kahootValidationStatus: KahootValidationStatus;
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
  getKahootPlayabilityStatus: () => void;
  updateTitleAndDescription: (headerInfo: KahootHeaderInfo) => void;
  selectQuestion: (kahootIndex: number) => void;
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
  kahootValidationStatus: {
    isPlayable: false,
    questions: []
  },
  overwriteKahoot: (newKahoot: Kahoot) => set(() => {
    return {
      kahoot: newKahoot,
      kahootIndex: 0
    }
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
  }),
  getKahootPlayabilityStatus: () => set((state) => {
    const kahoot = state.kahoot;

    if (kahoot) {
      let validationStatus: KahootValidationStatus = {
        isPlayable: true,
        questions: []
      }

      kahoot.questions.map((question: Question, index: number) => {
        let questionValidationErrors = {
          questionTitle: "",
          missingAnswerTitles: "",
          answerCorrectness: ""
        }

        // Validation question's title
        if (question.title === "" || question.title.trim() === "") {
          questionValidationErrors.questionTitle = `The question's title is missing`;
          validationStatus.isPlayable = false;
        }

        // Validating how many answer titles are missing
        let missingAnswerTitlesQty: number = 0;
        question.answers.map((answer: Answer, index: number) => {
          if (answer.text === "" || answer.text.trim() === "") {
            missingAnswerTitlesQty++;
            validationStatus.isPlayable = false;
          }
        })
        questionValidationErrors.missingAnswerTitles = missingAnswerTitlesQty > 0
          ? `${missingAnswerTitlesQty} answers missing`
          : ``;

        // Validating if there's at least one answer who has been checked (answer correctness)
        let hasCorrectAnswer = question.answers.some((answer: Answer) => answer.isCorrect);

        if (!hasCorrectAnswer) {
          questionValidationErrors.answerCorrectness = `Correct answer not selected`;
          validationStatus.isPlayable = false;
        }

        validationStatus.questions.push({
          kahootIndex: index,
          errors: questionValidationErrors
        })
      })

      return {
        kahootValidationStatus: validationStatus
      }
    }

    return state;
  }),
  updateTitleAndDescription: (headerInfo: KahootHeaderInfo) => set((state) => {
    const kahoot = state.kahoot;

    if (kahoot) {
      kahoot.title = headerInfo.title;
      kahoot.description = headerInfo.description

      return { kahoot }
    }

    return state;
  }),
  selectQuestion: (kahootIndex: number) => set((state) => {
    return {
      ...state,
      kahootIndex
    }
  })
}))

export default useKahootCreatorStore;
