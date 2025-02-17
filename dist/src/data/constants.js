"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_MULTI_PLAY_STATE = exports.INITIAL_MULTI_HOST_STATE = exports.GET_INITIAL_QUESTION_STATE = exports.INITIAL_1P_QUIZ_STATE = exports.QUIZ_START_TIME = exports.visibilities = exports.quizTypes = exports.quizVisibilities = exports.accountTypesEnum = exports.subjectList = void 0;
const lucide_react_1 = require("lucide-react");
const fa_1 = require("react-icons/fa");
const lucide_react_2 = require("lucide-react");
const io5_1 = require("react-icons/io5");
exports.subjectList = [
    { name: "mayreni", title: "Մայրենի", type: "Հումանիտար" },
    { name: "armenian", title: "Հայոց լեզու", type: "Հումանիտար" },
    { name: "russian", title: "Ռուսաց լեզու (Ռուսերեն)", type: "Հումանիտար" },
    { name: "english", title: "Անգլերեն", type: "Հումանիտար" },
    { name: "literature", title: "Գրականություն", type: "Հումանիտար" },
    { name: "foreign-lang", title: "Օտար լեզու", type: "Հումանիտար" },
    { name: "foreign-literature", title: "Օտար Գրականություն", type: "Հումանիտար" },
    { name: "algebra", title: "Հանրահաշիվ", type: "Մաթեմատիկական" },
    { name: "geometry", title: "Երկրաչափություն", type: "Մաթեմատիկական" },
    { name: "mathematics", title: "Մաթեմատիկա", type: "Մաթեմատիկական" },
    { name: "arithmetics", title: "Թվաբանություն", type: "Մաթեմատիկական" },
    { name: "advanced-math", title: "Բարձրագույն մաթեմատիկա", type: "Մաթեմատիկական" },
    { name: "physics", title: "Ֆիզիկա", type: "Բնագիտական" },
    { name: "chemistry", title: "Քիմիա", type: "Բնագիտական" },
    { name: "natural-env", title: "Ես և շրջակա աշխարհը", type: "Բնագիտական" },
    { name: "natural-history", title: "Բնագիտություն", type: "Բնագիտական" },
    { name: "geography", title: "Աշխարհագրություն", type: "Բնագիտական" },
    { name: "astronomy", title: "Աստղագիտություն", type: "Բնագիտական" },
    { name: "biology", title: "Կենսաբանություն", type: "Բնագիտական" },
    { name: "informatics", title: "Ինֆորմատիկա", type: "Մաթեմատիկական" },
    { name: "pe", title: "Ֆիզկուլտուրա", type: "Սպորտ և Առողջ Ապրելակերպ" },
    { name: "health", title: "Առողջ Ապրելակերպ", type: "Սպորտ և Առողջ Ապրելակերպ" },
    { name: "music", title: "Երաժշտություն", type: "Արվեստ և Արհեստ" },
    { name: "nzp", title: "ՆԶՊ", type: "Ուրիշ Առարկաներ" },
    { name: "chess", title: "Շախմատ", type: "Սպորտ և Առողջ Ապրելակերպ" },
    { name: "local-history", title: "Հայրենագիտություն", type: "Հումանիտար" },
    { name: "history", title: "Պատմություն", type: "Հումանիտար" },
    { name: "social-studies", title: "Հասարակագիտություն", type: "Հումանիտար" },
    { name: "technology", title: "Տեխնոլոգիա", type: "Արվեստ և Արհեստ" },
    { name: "religious-studies", title: "Հայոց եկեղեցու պատմություն", type: "Հումանիտար" },
    { name: "art", title: "Կերպարվեստ", type: "Արվեստ և Արհեստ" },
    { name: "reading", title: "Ինքնուրույն ընթերցանություն", type: "Հումանիտար" },
    { name: "others", title: "Ուրիշներ", type: "Ուրիշ Առարկաներ" },
];
exports.accountTypesEnum = [
    { type: "student", name: "Ուսանող", Icon: lucide_react_1.BookOpenText },
    { type: "teacher", name: "Ուսուցիչ", Icon: fa_1.FaChalkboardTeacher },
    { type: "personal", name: "Անձնական", Icon: lucide_react_1.User }
];
exports.quizVisibilities = [
    { type: "private", name: "Մասնավոր", Icon: lucide_react_1.Lock },
    { type: "public", name: "Ընդհանուր", Icon: lucide_react_1.Globe },
    { type: "unlisted", name: "Հղումով հասանելի", Icon: lucide_react_1.Link }
];
exports.quizTypes = [
    { type: 'pick-one', name: "Նշելով", Icon: lucide_react_2.CheckSquare },
    { type: "true-false", name: "Այո և Ոչ", Icon: io5_1.IoRadioButtonOn },
    { type: "text-answer", name: "Գրավոր", Icon: lucide_react_2.TextCursorInput }
];
exports.visibilities = {
    private: { name: "Մասնավոր", Icon: lucide_react_1.Lock },
    public: { name: "Ընդհանուր", Icon: lucide_react_1.Globe },
    unlisted: { name: "Հղումով հասանելի", Icon: lucide_react_1.Link }
};
// States
exports.QUIZ_START_TIME = 5;
exports.INITIAL_1P_QUIZ_STATE = {
    isStarted: false,
    startTimer: exports.QUIZ_START_TIME,
    currIdx: 0,
    isNextRound: false,
    correct: 0,
    wrong: 0,
};
const GET_INITIAL_QUESTION_STATE = (question) => ({
    currTime: question.timer,
    currAnswer: "",
});
exports.GET_INITIAL_QUESTION_STATE = GET_INITIAL_QUESTION_STATE;
exports.INITIAL_MULTI_HOST_STATE = {
    currIdx: 0,
    users: [],
    isStarted: false,
    startTimer: exports.QUIZ_START_TIME,
    showLeaderBoard: false,
    isEnded: false,
    placements: [],
    showPlacements: false
};
exports.INITIAL_MULTI_PLAY_STATE = {
    isSubmitted: false,
    isStarted: false,
    startTimer: exports.QUIZ_START_TIME,
    currQuiz: null,
    currIdx: 0,
    isEnded: false,
    place: 0,
    score: 0,
    formData: {
        name: "",
        quizId: "",
        userId: "",
        points: 0,
        socketId: ""
    }
};
