import { Globe, Link, Lock } from "lucide-react"
import { INameIcon} from "../types"
import { AccountType, QuestionType, QuizVisibility } from "@prisma/client"

export const ANSWER_FORMATS: Record<QuestionType, string[] | string> = {
     "pick_one": ["Ա","Բ","Գ","Դ","Ե","Զ"],
     "true_false": ["Այո", "Ոչ"],
     "text": ""
}
export const ANSWER_TYPES: Record<QuestionType, string> = {
     "pick_one": "Նշել Պատասխանը",
     "true_false": "Այո կամ ոչ",
     "text": "Գրավոր հարց"
}
export const ACCOUNT_TYPES: Record<AccountType, string> = {
     teacher: "Ուսուցիչ",
     student: "Աշակերտ",
     personal: "Անձնական",
}
export const VISIBILITIES: Record<QuizVisibility,INameIcon> = {
     private: {name: "Մասնավոր", Icon: Lock},
     public: {name: "Ընդհանուր", Icon: Globe},
     unlisted: {name: "Հղումով հասանելի", Icon: Link}
}