import { QUIZ_START_TIME } from "./others"
import { IOnePlayerQuizState, IQuestion, IQuestionState, IMultiplayerHostState, IMultiplayerPlayState } from "../types"

export const INITIAL_1P_QUIZ_STATE: IOnePlayerQuizState = {
     isStarted: false,
     startTimer: QUIZ_START_TIME,
     currIdx: 0,
     isNextRound: false,
     correct: 0,
     wrong: 0,
     points: 0,
}
export const GET_INITIAL_QUESTION_STATE = (question: IQuestion): IQuestionState => ({
     currTime: question.timer,
     currAnswerId: null,
})
export const INITIAL_MULTI_HOST_STATE: IMultiplayerHostState = {
     currIdx: 0,
     users: [],
     isStarted: false,
     startTimer: QUIZ_START_TIME,
     placements: [],
     showPlacements: false,
     phase: "countdown"
}
export const GET_INITIAL_MULTI_PLAY_STATE = (userId: string): IMultiplayerPlayState => ({
     isStarted: false,
     startTimer: QUIZ_START_TIME,
     currQuiz: null,
     currIdx: 0,
     place: 0,
     phase: "lobby",
     formData: {
          name: "",
          quizId: "",
          userId,
          points: 0,
          socketId: ""
     }
})