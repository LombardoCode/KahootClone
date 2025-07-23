import { KahootHeaderInfo } from "@/app/interfaces/Creator/KahootHeaderInfo.interface";
import { Answer, Kahoot, PointsMultiplier, Question, QuizQuestionLayoutTypes, TimeLimits } from "@/app/interfaces/Kahoot/Kahoot.interface";
import { debugLog } from "@/app/utils/debugLog";
import { create } from "zustand";

interface KahootValidationStatus {
  isPlayable: boolean;
  questions: KahootQuestionValidation[]
}

export interface KahootQuestionValidation {
  questionIndex: number;
  errors: {
    questionTitle: string;
    missingAnswerTitles: string;
    answerCorrectness: string;
  }
}

interface KahootCreatorStore {
  kahoot: Kahoot | null;
  questionIndex: number;
  isKahootFormDirty: boolean;
  resetIsKahootFormDirty: () => void;
  kahootValidationStatus: KahootValidationStatus;
  overwriteKahoot: (newKahoot: Kahoot) => void;
  setKahootTitleAndDescription: (kahootInfo: { title: string, description: string }) => void;
  setKahootsQuestionIndex: (index: number) => void;
  selectedQuestion: () => Question | null;
  addQuestion: (quizQuestionLayoutType: QuizQuestionLayoutTypes) => void;
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
  selectQuestion: (questionIndex: number) => void;

  // Media files
  updateQuestionMediaUrl: (index: number, mediaUrl: string) => void;
  removeQuestionMediaUrl: (questionIndex: number) => void;
  updateKahootMediaUrl: (url: string) => void;
  removeKahootMediaUrl: () => void;
}

const createNewQuestion = (quizQuestionLayoutType: QuizQuestionLayoutTypes): Question => {
  // Create answers
  let answers: Answer[] = createAnswersForSpecificLayout(quizQuestionLayoutType);

  return {
    id: 0,
    title: "",
    layout: quizQuestionLayoutType,
    timeLimit: TimeLimits.THIRTY_S,
    pointsMultiplier: PointsMultiplier.STANDARD,
    mediaUrl: "",
    answers
  }
}

const createAnswersForSpecificLayout = (quizQuestionLayoutType: QuizQuestionLayoutTypes): Answer[] => {
  let answers: Answer[] = [];

  if (quizQuestionLayoutType === QuizQuestionLayoutTypes.CLASSIC) {
    for (let i = 0; i < 4; i++) {
      answers.push(addNewAnswer(""));
    }
  } else if (quizQuestionLayoutType === QuizQuestionLayoutTypes.TRUE_OR_FALSE) {
    answers.push(addNewAnswer("True"));
    answers.push(addNewAnswer("False"));
  }

  return answers;
}

const addNewAnswer = (text: string): Answer => {
  return {
    id: 0,
    text,
    isCorrect: false
  }
}

const useKahootCreatorStore = create<KahootCreatorStore>((set, get) => ({
  kahoot: null,
  questionIndex: 0,
  isKahootFormDirty: false,
  resetIsKahootFormDirty: () => set(() => ({
    isKahootFormDirty: false
  })),
  kahootValidationStatus: {
    isPlayable: false,
    questions: []
  },
  overwriteKahoot: (newKahoot: Kahoot) => set(() => {
    return {
      kahoot: newKahoot,
      questionIndex: 0
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
    questionIndex: index
  })),
  selectedQuestion: () => {
    const state = get();
    return state.kahoot ? state.kahoot.questions[0] : null;
  },
  addQuestion: (quizQuestionLayoutType: QuizQuestionLayoutTypes) => set((state) => {
    if (state.kahoot) {
      const newQuestion = createNewQuestion(quizQuestionLayoutType);
      const updatedQuestions = [...state.kahoot.questions, newQuestion];
      const newQuestionIndex = updatedQuestions.length - 1;

      return {
        kahoot: {
          ...state.kahoot,
          questions: updatedQuestions
        },
        questionIndex: newQuestionIndex,
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
      if (kahoot.questions[questionIndex].layout === QuizQuestionLayoutTypes.TRUE_OR_FALSE) {
        for (let i = 0; i < kahoot.questions[questionIndex].answers.length; i++) {
          kahoot.questions[questionIndex].answers[i].isCorrect = false;
        }
      }

      kahoot.questions[questionIndex].answers[answerIndex].isCorrect = isCorrect;
      state.isKahootFormDirty = true;
    }
    return { kahoot };
  }),
  updateQuestionLayout: (questionIndex: number, questionLayout: QuizQuestionLayoutTypes) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot?.questions[questionIndex]) {
      // Remove all the existing answers and create new empty answers when the question layout changes to a different one
      if (kahoot.questions[questionIndex].layout !== questionLayout) {
        kahoot.questions[questionIndex].layout = questionLayout;
        kahoot.questions[questionIndex].answers = [];
        kahoot.questions[questionIndex].answers = createAnswersForSpecificLayout(kahoot.questions[questionIndex].layout);
        state.isKahootFormDirty = true;
      }
    }
    return { kahoot };
  }),
  updateQuestionTimeLimit: (questionIndex: number, questionTimeLimit: TimeLimits) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      if (kahoot.questions[questionIndex].timeLimit !== questionTimeLimit) {
        kahoot.questions[questionIndex].timeLimit = questionTimeLimit;
        state.isKahootFormDirty = true;
      }
    }
    return { kahoot };
  }),
  updateQuestionPoints: (questionIndex: number, questionPoints: PointsMultiplier) => set((state) => {
    const kahoot = state.kahoot;
    if (kahoot) {
      if (kahoot.questions[questionIndex].pointsMultiplier !== questionPoints) {
        kahoot.questions[questionIndex].pointsMultiplier = questionPoints;
        state.isKahootFormDirty = true;
      }
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
      state.isKahootFormDirty = true;

      // And then we reposition the questionIndex back (eg. if the user is on the last question and then they decide to remove the last question, we will reposition the questionIndex to the very last question available)
      if (state.questionIndex >= kahoot.questions.length) {
        state.questionIndex = kahoot.questions.length - 1;
      }

      return {
        kahoot: {
          ...kahoot,
          questions: [...kahoot.questions]
        },
        questionIndex: state.questionIndex
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
          questionIndex: index,
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
  selectQuestion: (questionIndex: number) => set((state) => {
    return {
      ...state,
      questionIndex
    }
  }),

  // Media files
  updateQuestionMediaUrl: (index: number, mediaUrl: string) => {
    set(state => {
      if (!state.kahoot) {
        return state;
      }

      const questions: Question[] = [...state.kahoot.questions];

      questions[index].mediaUrl = mediaUrl;

      return {
        kahoot: {
          ...state.kahoot,
          questions
        },
        isKahootFormDirty: true
      }
    })
  },
  removeQuestionMediaUrl: (questionIndex: number) => {
    set(state => {
      if (!state.kahoot) {
        return state;
      }

      const updatedQuestions: Question[] = [...state.kahoot.questions];
      updatedQuestions[questionIndex].mediaUrl = "";

      return {
        kahoot: {
          ...state.kahoot,
          questions: updatedQuestions
        },
        isKahootFormDirty: true
      }
    })
  },
  updateKahootMediaUrl: (url: string) => {
    set(state => {
      if (!state.kahoot) {
        return state;
      }

      state.kahoot.mediaUrl = url;

      return {
        kahoot: {
          ...state.kahoot
        }
      }
    })
  },
  removeKahootMediaUrl: () => {
    set(state => {
      if (!state.kahoot) {
        return state;
      }

      state.kahoot.mediaUrl = null;

      return {
        kahoot: {
          ...state.kahoot
        }
      }
    })
  }
}))

export default useKahootCreatorStore;
