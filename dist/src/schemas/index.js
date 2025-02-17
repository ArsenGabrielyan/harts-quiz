"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiplayerQuizFormSchema = exports.TextAnswerFormSchema = exports.SoundSwitchFormSchema = exports.SettingsSchema = exports.QuizEditorSchema = exports.QuestionSchema = exports.RegisterSchema = exports.LoginSchema = exports.NewPasswordSchema = exports.ResetSchema = void 0;
const constants_1 = require("@/data/constants");
const z = __importStar(require("zod"));
const ACC_TYPE_ENUM = [
    constants_1.accountTypesEnum[0].type,
    ...constants_1.accountTypesEnum.slice(1).map(p => p.type)
];
const QUIZ_VISIBILITY_ENUM = [
    constants_1.quizVisibilities[0].type,
    ...constants_1.quizVisibilities.slice(1).map(p => p.type)
];
const QUESTION_TYPE_ENUM = [
    constants_1.quizTypes[0].type,
    ...constants_1.quizTypes.slice(1).map(p => p.type)
];
const SUBJECT_NAME_ENUM = [
    constants_1.subjectList[0].name,
    ...constants_1.subjectList.slice(1).map(p => p.name)
];
exports.ResetSchema = z.object({
    email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
});
exports.NewPasswordSchema = z.object({
    password: z.string().min(8, "Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")
});
exports.LoginSchema = z.object({
    email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
    password: z.string().min(1, "Մուտքագրեք գաղտնաբառը մուտք գործելու համար"),
    code: z.optional(z.string())
});
exports.RegisterSchema = z.object({
    name: z.string().min(2, "Մուտքագրեք ձեր անունը և ազգանունը").max(100, "Անունը և ազգանունը շատ երկար է"),
    email: z.string().email("Մուտքագրեք վավերական էլ․ փոստ"),
    username: z.string().min(2, "Մուտքագրեք ձեր օգտանունը").max(100, "օգտանունը շատ երկար է"),
    accountType: z.enum(ACC_TYPE_ENUM),
    password: z.string().min(8, "Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")
});
exports.QuestionSchema = z.object({
    question: z.string().min(1, "Պարտադիր է լրացնել հարցը"),
    answers: z.array(z.string().min(1, "Պարտադիր է լրացնել պատասխանները")),
    correct: z.string().min(1, "Պարտադիր է ընտրել ճիշտ պատասխանը"),
    timer: z.number().int("Տևողությունը պետք է լինի ամբողջ թիվ").gte(0, "Տևողությունը պետք է լինի դրական").refine(val => val !== 0, "Տևողությունը պետք չէ լինի 0"),
    points: z.number().int("Միավորը պետք է լինի ամբողջ թիվ").gte(0, "Միավորը պետք է լինի դրական").refine(val => val !== 0, "Միավորը պետք չէ լինի 0"),
    type: z.enum(QUESTION_TYPE_ENUM),
    description: z.optional(z.string())
});
exports.QuizEditorSchema = z.object({
    name: z.string().min(2, "Պարտադիր է լրացնել հարցաշարի անունը"),
    description: z.optional(z.string()),
    visibility: z.enum(QUIZ_VISIBILITY_ENUM),
    subject: z.enum(SUBJECT_NAME_ENUM),
    questions: z.array(exports.QuestionSchema).nonempty("Ավելացնել մի քանի հարցեր հարցաշար ստեղծելու համար")
});
exports.SettingsSchema = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email("Մուտքագրեք վավերական էլ․ փոստ")),
    username: z.optional(z.string()),
    organization: z.optional(z.string()),
    password: z.optional(z.string().min(8, "Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")),
    newPassword: z.optional(z.string().min(8, "Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ")),
    accountType: z.enum(ACC_TYPE_ENUM),
    isTwoFactorEnabled: z.optional(z.boolean()),
    soundEffectOn: z.optional(z.boolean()),
    showFavoriteSubject: z.optional(z.boolean()),
    bio: z.optional(z.string()),
    favoriteSubject: z.enum(SUBJECT_NAME_ENUM)
})
    .refine(data => {
    if (data.password && !data.newPassword) {
        return false;
    }
    return true;
}, {
    message: "Պարտադիր է գրել նոր գաղտնաբառ",
    path: ["newPassword"]
})
    .refine(data => {
    if (data.newPassword && !data.password) {
        return false;
    }
    return true;
}, {
    message: "Պարտադիր է գրել գաղտնաբառ",
    path: ["password"]
});
exports.SoundSwitchFormSchema = z.object({
    soundEffectOn: z.boolean(),
});
exports.TextAnswerFormSchema = z.object({
    answer: z.string().min(1, "Խնդրում ենք մուտքագրել Ձեր պատասխանը։")
});
exports.MultiplayerQuizFormSchema = z.object({
    quizCode: z.string().min(1, "Մուտքագրեք խաղի կոդը"),
    name: z.string().min(1, "Մուտքագրեք աշակերտի անունը"),
    soundEffectOn: z.boolean(),
});
