import { ISelectData, ISubject, SubjectName } from "@/lib/types";
import { AccountType, QuestionType, QuizVisibility } from "@prisma/client";
import { BookOpenText, Globe, Link, Lock, User } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CheckSquare, TextCursorInput } from "lucide-react"
import { IoRadioButtonOn } from "react-icons/io5"

export const QUIZ_START_TIME = 5;
export const SUBJECT_LIST: ISubject[] = [
     {name: SubjectName.NativeLang, title: "Մայրենի", type: "Հումանիտար"},
     {name: SubjectName.Armenian, title: "Հայոց լեզու", type: "Հումանիտար"},
     {name: SubjectName.Russian, title: "Ռուսաց լեզու (Ռուսերեն)", type: "Հումանիտար"},
     {name: SubjectName.English, title: "Անգլերեն", type: "Հումանիտար"},
     {name: SubjectName.Literature, title: "Գրականություն", type: "Հումանիտար"},
     {name: SubjectName.ForeignLang, title: "Օտար լեզու", type: "Հումանիտար"},
     {name: SubjectName.ForeignLiterature, title: "Օտար Գրականություն", type: "Հումանիտար"},
     {name: SubjectName.Algebra, title: "Հանրահաշիվ", type: "Մաթեմատիկական"},
     {name: SubjectName.Geometry, title: "Երկրաչափություն", type: "Մաթեմատիկական"},
     {name: SubjectName.Maths, title: "Մաթեմատիկա", type: "Մաթեմատիկական"},
     {name: SubjectName.Arithmetics, title: "Թվաբանություն", type: "Մաթեմատիկական"},
     {name: SubjectName.AdvancedMaths, title: "Բարձրագույն մաթեմատիկա", type: "Մաթեմատիկական"},
     {name: SubjectName.Physics, title: "Ֆիզիկա", type: "Բնագիտական"},
     {name: SubjectName.Chemistry, title: "Քիմիա", type: "Բնագիտական"},
     {name: SubjectName.Science, title: "Բնագիտություն", type: "Բնագիտական"},
     {name: SubjectName.Geography, title: "Աշխարհագրություն", type: "Բնագիտական"},
     {name: SubjectName.Astronomy, title: "Աստղագիտություն", type: "Բնագիտական"},
     {name: SubjectName.Biology, title: "Կենսաբանություն", type: "Բնագիտական"},
     {name: SubjectName.Informatics, title: "Ինֆորմատիկա", type: "Մաթեմատիկական"},
     {name: SubjectName.PE, title: "Ֆիզկուլտուրա", type: "Սպորտ և Առողջ Ապրելակերպ"},
     {name: SubjectName.Health, title: "Առողջ Ապրելակերպ", type: "Սպորտ և Առողջ Ապրելակերպ"},
     {name: SubjectName.Music, title: "Երաժշտություն",type: "Արվեստ և Արհեստ"},
     {name: SubjectName.MilStudies, title: "ՆԶՊ",type: "Ուրիշ Առարկաներ"},
     {name: SubjectName.Chess, title: "Շախմատ", type: "Սպորտ և Առողջ Ապրելակերպ"},
     {name: SubjectName.History, title: "Պատմություն", type: "Հումանիտար"},
     {name: SubjectName.SocialStudies, title: "Հասարակագիտություն", type: "Հումանիտար"},
     {name: SubjectName.Tech, title: "Տեխնոլոգիա",type: "Արվեստ և Արհեստ"},
     {name: SubjectName.ReligiousStudies, title: "Հայոց եկեղեցու պատմություն", type: "Հումանիտար"},
     {name: SubjectName.Art, title: "Կերպարվեստ",type: "Արվեստ և Արհեստ"},
     {name: SubjectName.Reading, title: "Ինքնուրույն ընթերցանություն", type: "Հումանիտար"},
     {name: SubjectName.Other, title: "Ուրիշներ",type: "Ուրիշ Առարկաներ"},
] as const;
export const ENUM_ACCOUNT_TYPES: ISelectData<AccountType>[] = [
     {type: "student", name: "Ուսանող", Icon: BookOpenText},
     {type: "teacher", name: "Ուսուցիչ", Icon: FaChalkboardTeacher},
     {type: "personal", name: "Անձնական", Icon: User}
]
export const VISIBILITIES_LIST: ISelectData<QuizVisibility>[] = [
     {type: "private", name: "Մասնավոր", Icon: Lock},
     {type: "public", name: "Ընդհանուր", Icon: Globe},
     {type: "unlisted", name: "Հղումով հասանելի", Icon: Link}
]
export const QUIZ_TYPES_LIST: ISelectData<QuestionType>[] = [
     {type: 'pick_one', name: "Նշելով", Icon: CheckSquare},
     {type: "true_false", name: "Այո և Ոչ", Icon: IoRadioButtonOn},
     {type: "text", name: "Գրավոր", Icon: TextCursorInput}
]