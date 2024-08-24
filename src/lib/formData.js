import AccountType from "@/components/forms/accTypeForm";
import AvatarForm from "@/components/forms/avatarForm";
import OrganizationAndPFP from "@/components/forms/orgAndImgForm";
import MiscFields from "@/components/forms/otherForm";
import { badWordsInQuizEditor, badwords } from "./badwords"

export const INITIAL_LOGINDATA = {
     email: '',
     password: ''
}
export const INITIAL_SIGNUPDATA = {
     name: '',
     email: '',
     bdate: '',
     password: '',
     passConfirm: '',
     agreed: false
}
export const GET_INITIAL_SIGNUP2 = id => ({
     id, accountType: '',
     organization: '',
     username: '',
     favoriteSubject: '',
     image: null
})
export const INITIAL_SIGNUP3 = {
     bdate: '',
     organization: '',
     favoriteSubject: ''
}
export const VALIDATION_REGEX = {
     emailReg: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
     passReg: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+#^-])?[A-Za-z\d@$!%*?&+#^-]{8,}$/i,
     dateReg: /^\d{4}-\d{2}-\d{2}$/,
}
export const PASS_RESET_INITIAL = {
     password: '',
     passConfirm: ''
}
export const GET_MULTISTEP_DATA = (data,updateFields,accountType) => [
     <AccountType key={0} {...data} updateFields={updateFields}/>,
     (accountType==='student') ? <AvatarForm {...data} updateFields={updateFields} key={1} /> : <OrganizationAndPFP {...data} updateFields={updateFields} key={1}/>,
     <MiscFields {...data} updateFields={updateFields} key={2}/>
]
export function validateJoinGame(formData){
     const {quizId,playerName} = formData
     let errTxt = '';
     if(!quizId || quizId.trim()==='') errTxt = 'Խաղի կոդը պարտադիր է'
     else if(!playerName || playerName.trim()==='') errTxt = 'Անունը պարտադիր է'
     else if(badwords.some(val=>playerName.toLowerCase().includes(val.toLowerCase()))) errTxt = "Վատ բառ կամ հայհոյանք տեղադրել չի կարելի";
     else errTxt = '';
     return errTxt;
}
export function validateLogin(loginData){
     const {email, password} = loginData;
     let result = '';
     if(!email || email.trim()==='') result = "Էլ․ փոստի հասցեն պարտադիր է"
     else if(!VALIDATION_REGEX.emailReg.test(email)) result = 'Էլ․ փոստի հասցեի ֆորմատը սխալ է'
     else if(!password || password.trim()==='') result = "Գաղտնաբառը պարտադիր է"
     else if(!VALIDATION_REGEX.passReg.test(password)) result = 'Գաղտնաբառը պետք է ունենա առնվազն 1 թիվ, 1 տառ, 1 նշան և պետք է ունենա մինիմում 8 նիշ';
     else result = '';
     return result;
}
export function validateSignup(signupData){
     const {name,email,bdate,password,passConfirm,agreed} = signupData;
     let result = '';
     if(!name || name.trim() === '') result = 'Անունը Պարտադիր է';
     else if(name.length <= 2) result = 'Անունը շատ կարճ է';
     else if(badwords.some(val=>name.toLowerCase().includes(val.toLowerCase()))) result = "Անվան մեջ վատ բառ կամ հայհոյանք տեղադրել չի կարելի"
     else if(!email || email.trim()==='') result = "Էլ․ փոստի հասցեն պարտադիր է"
     else if(!VALIDATION_REGEX.emailReg.test(email)) result = 'Էլ․ փոստի հասցեի ֆորմատը սխալ է'
     else if(!bdate || bdate.trim()==='') result = "Ծննդյան օրը պարտադիր է"
     else if(!VALIDATION_REGEX.dateReg.test(bdate)) result = "Ծննդյան օրվա ֆորմատը սխալ է"
     else if(!password || password.trim()==='') result = "Գաղտնաբառը պարտադիր է"
     else if(!VALIDATION_REGEX.passReg.test(password)) result = 'Գաղտնաբառը պետք է ունենա առնվազն 1 թիվ, 1 տառ, 1 նշան և պետք է ունենա մինիմում 8 նիշ';
     else if(!passConfirm || passConfirm.trim()==='') result = "Պարտադիր է կրկնել ներմուծած գաղտնաբառը"
     else if(passConfirm!==password) result = 'Գաղտնաբառերը չեն համընկնում';
     else if(!agreed) result = "Պետք է համաձայնես, որպեսզի գրանցվես"
     else result = '';
     return result;
}
export function validateWelcomePage(formData, page){
     const {accountType, organization, username, image, favoriteSubject} = formData;
     let result = '';
     if(page===0 && (!accountType || accountType.trim()==='')) result = "Պարտադիր է ընտրել տեսակը";
     else if(page === 1 && (!image || accountType==='student' ? typeof image !== 'object' : typeof image !== 'string')) result = "Նկարը պարտադիր է";
     else if(badwords.some(val=>username.toLowerCase().includes(val.toLowerCase()))) result = "Օգտանվան մեջ վատ բառ կամ հայհոյանք տեղադրել չի կարելի";
     else if(badwords.some(val=>organization.toLowerCase().includes(val.toLowerCase()))) result = "Կազմակերպության անվան մեջ վատ բառ կամ հայհոյանք տեղադրել չի կարելի";
     else if(page=== 2 && (!favoriteSubject || favoriteSubject.trim()==="")) result = "Պարտադիր է նշել ձեր սիրած առարկան"
     else result = '';
     return result;
}
export function validateWelcomeOauth(formData){
     const {organization, bdate, favoriteSubject} = formData
     let result = ''
     if(!bdate || bdate.trim()==='') result = "Ծննդյան օրը պարտադիր է"
     else if(!VALIDATION_REGEX.dateReg.test(bdate)) result = "Ծննդյան օրվա ֆորմատը սխալ է"
     else if(badwords.some(val=>organization.toLowerCase().includes(val.toLowerCase()))) result = "Կազմակերպության անվան մեջ վատ բառ կամ հայհոյանք տեղադրել չի կարելի";
     else if(!favoriteSubject || favoriteSubject.trim()==="") result = "Պարտադիր է նշել ձեր սիրած առարկան"
     else result = '';
     return result
}
export function validateEmail(email){
     let result = "";
     if(!email || email.trim()==='') result = "Էլ․ փոստի հասցեն պարտադիր է"
     else if(!VALIDATION_REGEX.emailReg.test(email)) result = 'Էլ․ փոստի հասցեի ֆորմատը սխալ է'
     else result = "";
     return result;
}
export function validatePasswords(passData){
     const {password, passConfirm} = passData;
     let result = ''
     if(!password || password.trim()==='') result = "Գաղտնաբառը պարտադիր է"
     else if(!VALIDATION_REGEX.passReg.test(password)) result = 'Գաղտնաբառը պետք է ունենա առնվազն 1 թիվ, 1 տառ, 1 նշան և պետք է ունենա մինիմում 8 նիշ';
     else if(!passConfirm || passConfirm.trim()==='') result = "Պարտադիր է կրկնել ներմուծած գաղտնաբառը"
     else if(passConfirm!==password) result = 'Գաղտնաբառերը չեն համընկնում';
     else result = '';
     return result;
}
export function validateQuizEditor(formData){
     const {name,questions,visibility,subject,description} = formData;
     let result = '';
     if(!name || name.trim()==='') result = "Անունը պարտադիր է"
     else if(badWordsInQuizEditor.some(val=>name.toLowerCase().includes(val.toLowerCase()))) result = "Անվան մեջ հայհոյանք կամ վատ բառ տեղադրել չի կարելի"
     else if(badWordsInQuizEditor.some(val=>description.toLowerCase().includes(val.toLowerCase()))) result = "Նկարագրության մեջ հայհոյանք կամ վատ բառ տեղադրել չի կարելի"
     else if(!visibility || visibility.trim()==='') result = "Տեսանելիությունը պարտադիր է";
     else if(!questions || questions.length===0) result = "Պարտադիր է ավելացնել գոնե 1-ից ավել հարց";
     else if(!subject || subject.trim()==='') result = "Առարկան պարտադիր է"
     else if(questions.some(val=>(!val.question || val.question.trim()===''))) result = "Հարցեր նշելը պարտադիր է"
     else if(questions.some(val=>badWordsInQuizEditor.some(word=>val.description.toLowerCase().includes(word.toLowerCase())))) result = "Ամեն Հարցի Նկարագրության մեջ հայհոյանք կամ վատ բառ տեղադրել չի կարելի"
     else if(questions.some(val=>val.type==='pick-one' && val.answers.some(val=>(!val || val.trim()==='')))) result = "Պատասխաններ նշելը պարտադիր է (Վերաբերվում է նշովի հարցերին)"
     else if(questions.some(val=>val.type==='pick-one' && val.answers.some(val=>badWordsInQuizEditor.some(word=>val.toLowerCase().includes(word.toLowerCase()))))) result = "Պատասխանների մեջ հայհոյանք կամ վատ բառ տեղադրել չի կարելի (Վերաբերվում է նշովի հարցերին)"
     else if(questions.some(val=>val.type==='pick-one' && !val.answers.includes(val.correct))) result = "Ճիշտ պատասխանը պատասխանների ցանկում գոյություն չունի (Վերաբերվում է նշովի հարցերին)"
     else if(questions.some(val=>(!val.correct || val.correct.trim()===''))) result = "Նշել ճիշտ պատասխանը"
     else if(questions.some(val=>badWordsInQuizEditor.some(word=>val.correct.toLowerCase().includes(word.toLowerCase())))) result = "Ճիշտ պատասխանը համարվում է որպես հայհոյանք կամ վատ բառ։ Հեռացնել այն"
     else if(questions.some(val=>!val.points)) result = "Նշել, թե քանի միավոր է ստանալու ճիշտ պատասխանելուց հետո"
     else if(questions.some(val=>!val.timer)) result = "Նշել, թե քանի վայրկյան պիտի պատասխանի հարցին"
     else if(questions.some(val=>val.timer > 600 || val.timer < 5)) result = "Հարցի տևողություն պետք է տևի 5 վայրկյանից 5 րոպե"
     else result = "";
     return result;
}
export function validateSettings(formData, accountType){
     const {name, email, username, organization, image, bio, favoriteSubject} = formData
     let result = "";
     if(!name || name.trim() === '') result = 'Անունը Պարտադիր է';
     else if(name.length <= 2) result = 'Անունը շատ կարճ է';
     else if(badwords.some(val=>name.toLowerCase().includes(val.toLowerCase()))) result = "Անվան մեջ վատ բառ կամ հայհոյանք տեղադրել չի կարելի"
     else if(!email || email.trim()==='') result = "Էլ․ փոստի հասցեն պարտադիր է"
     else if(!VALIDATION_REGEX.emailReg.test(email)) result = 'Էլ․ փոստի հասցեի ֆորմատը սխալ է'
     else if(badwords.some(val=>username.toLowerCase().includes(val.toLowerCase()))) result = "Օգտանվան մեջ վատ բառ կամ հայհոյանք տեղադրել չի կարելի";
     else if(badwords.some(val=>organization.toLowerCase().includes(val.toLowerCase()))) result = "Կազմակերպության անվան մեջ վատ բառ կամ հայհոյանք տեղադրել չի կարելի"
     else if(!image || accountType==='student' ? typeof image !== 'object' : typeof image !== 'string') result = "Նկարը պարտադիր է";
     else if(badwords.some(val=>bio.toLowerCase().includes(val.toLowerCase()))) result = "Նկարագրության մեջ վատ բառ կամ հայհոյանք տեղադրել չի կարելի"
     else if(!favoriteSubject || favoriteSubject.trim()==="") result = "Պարտադիր է նշել ձեր սիրած առարկան"
     else result = "";
     return result
}