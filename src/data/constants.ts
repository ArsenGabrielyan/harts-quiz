import { IAccountType, IQuestion, IQuiz, ISelectedQuiz, ISubject } from "@/data/types/other-types";
import { BookOpenText, User } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";

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
export const INITIAL_QUIZEDITOR_DATA: IQuiz = {
     name: '',
     description: "",
     questions: [],
     visibility: '',
     subject: ''
}
export const accountTypesEnum: IAccountType[] = [
     {type: "student", name: "Ուսանող", Icon: BookOpenText},
     {type: "teacher", name: "Ուսուցիչ", Icon: FaChalkboardTeacher},
     {type: "personal", name: "Անձնական", Icon: User}
]
export const INITIAL_SELECTED_QUIZ: ISelectedQuiz = {
     question: {} as IQuestion,
     index: null
}