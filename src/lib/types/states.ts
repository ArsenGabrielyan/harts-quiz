import { QuizPhase, IQuizUser, IQuizPlacement, QuizDocument } from "./quiz"

export interface IOnePlayerQuizState {
     startTimer: number,
     currIdx: number,
     correct: number,
     wrong: number,
     points: number,
     phase: Exclude<QuizPhase,"leaderboard"|"waiting"> | "result",
     correctText: string | null
}
export interface IQuestionState {
     currTime: number,
     currAnswerId: number | null,
}
export interface IMultiplayerHostState {
     currIdx: number,
     users: IQuizUser[],
     isStarted: boolean,
     startTimer: number,
     placements: IQuizPlacement[],
     showPlacements: boolean,
     phase: QuizPhase
}
export interface IMultiplayerPlayState {
     isStarted: boolean,
     startTimer: number,
     currQuiz: QuizDocument | null,
     currIdx: number,
     place: number,
     formData: IQuizUser,
     phase: QuizPhase
}