import { AccountType, IMultiplayerHostState, IMultiplayerPlayState, INameIcon, IOnePlayerQuizState, IQuestion, IQuestionState, ISelectData, ISubject, QuestionType, QuizVisibility } from "@/data/types/other-types";
import { BookOpenText, Globe, Link, Lock, User } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CheckSquare, TextCursorInput } from "lucide-react"
import { IoRadioButtonOn } from "react-icons/io5"

export const subjectList: ISubject[] = [
     {name: "mayreni", title: "Մայրենի", type: "Հումանիտար"},
     {name: "armenian", title: "Հայոց լեզու", type: "Հումանիտար"},
     {name: "russian", title: "Ռուսաց լեզու (Ռուսերեն)", type: "Հումանիտար"},
     {name: "english", title: "Անգլերեն", type: "Հումանիտար"},
     {name: "literature", title: "Գրականություն", type: "Հումանիտար"},
     {name: "foreign-lang", title: "Օտար լեզու", type: "Հումանիտար"},
     {name: "foreign-literature", title: "Օտար Գրականություն", type: "Հումանիտար"},
     {name: "algebra", title: "Հանրահաշիվ", type: "Մաթեմատիկական"},
     {name: "geometry", title: "Երկրաչափություն", type: "Մաթեմատիկական"},
     {name: "mathematics", title: "Մաթեմատիկա", type: "Մաթեմատիկական"},
     {name: "arithmetics", title: "Թվաբանություն", type: "Մաթեմատիկական"},
     {name: "advanced-math", title: "Բարձրագույն մաթեմատիկա", type: "Մաթեմատիկական"},
     {name: "physics", title: "Ֆիզիկա", type: "Բնագիտական"},
     {name: "chemistry", title: "Քիմիա", type: "Բնագիտական"},
     {name: "natural-env", title: "Ես և շրջակա աշխարհը", type: "Բնագիտական"},
     {name: "natural-history", title: "Բնագիտություն", type: "Բնագիտական"},
     {name: "geography", title: "Աշխարհագրություն", type: "Բնագիտական"},
     {name: "astronomy", title: "Աստղագիտություն", type: "Բնագիտական"},
     {name: "biology", title: "Կենսաբանություն", type: "Բնագիտական"},
     {name: "informatics", title: "Ինֆորմատիկա", type: "Մաթեմատիկական"},
     {name: "pe", title: "Ֆիզկուլտուրա", type: "Սպորտ և Առողջ Ապրելակերպ"},
     {name: "health", title: "Առողջ Ապրելակերպ", type: "Սպորտ և Առողջ Ապրելակերպ"},
     {name: "music", title: "Երաժշտություն",type: "Արվեստ և Արհեստ"},
     {name: "nzp", title: "ՆԶՊ",type: "Ուրիշ Առարկաներ"},
     {name: "chess", title: "Շախմատ", type: "Սպորտ և Առողջ Ապրելակերպ"},
     {name: "local-history", title: "Հայրենագիտություն", type: "Հումանիտար"},
     {name: "history", title: "Պատմություն", type: "Հումանիտար"},
     {name: "social-studies", title: "Հասարակագիտություն", type: "Հումանիտար"},
     {name: "technology", title: "Տեխնոլոգիա",type: "Արվեստ և Արհեստ"},
     {name: "religious-studies", title: "Հայոց եկեղեցու պատմություն", type: "Հումանիտար"},
     {name: "art", title: "Կերպարվեստ",type: "Արվեստ և Արհեստ"},
     {name: "reading", title: "Ինքնուրույն ընթերցանություն", type: "Հումանիտար"},
     {name: "others", title: "Ուրիշներ",type: "Ուրիշ Առարկաներ"},
]
export const accountTypesEnum: ISelectData<AccountType>[] = [
     {type: "student", name: "Ուսանող", Icon: BookOpenText},
     {type: "teacher", name: "Ուսուցիչ", Icon: FaChalkboardTeacher},
     {type: "personal", name: "Անձնական", Icon: User}
]
export const quizVisibilities: ISelectData<QuizVisibility>[] = [
     {type: "private", name: "Մասնավոր", Icon: Lock},
     {type: "public", name: "Ընդհանուր", Icon: Globe},
     {type: "unlisted", name: "Հղումով հասանելի", Icon: Link}
]
export const quizTypes: ISelectData<QuestionType>[] = [
     {type: 'pick-one', name: "Նշելով", Icon: CheckSquare},
     {type: "true-false", name: "Այո և Ոչ", Icon: IoRadioButtonOn},
     {type: "text-answer", name: "Գրավոր", Icon: TextCursorInput}
]
export const visibilities: Record<QuizVisibility,INameIcon> = {
     private: {name: "Մասնավոր", Icon: Lock},
     public: {name: "Ընդհանուր", Icon: Globe},
     unlisted: {name: "Հղումով հասանելի", Icon: Link}
}

// States
export const QUIZ_START_TIME = 5;
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
     currAnswer: "",
})
export const INITIAL_MULTI_HOST_STATE: IMultiplayerHostState = {
     currIdx: 0,
     users: [],
     isStarted: false,
     startTimer: QUIZ_START_TIME,
     showLeaderBoard: false,
     isEnded: false,
     placements: [],
     showPlacements: false
}
export const GET_INITIAL_MULTI_PLAY_STATE = (userId: string): IMultiplayerPlayState => ({
     isSubmitted: false,
     isStarted: false,
     startTimer: QUIZ_START_TIME,
     currQuiz: null,
     currIdx: 0,
     isEnded: false,
     place: 0,
     score: 0,
     formData: {
          name: "",
          quizId: "",
          userId,
          points: 0,
          socketId: ""
     }
})