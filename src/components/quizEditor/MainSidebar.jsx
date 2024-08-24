import Button from "@/components/formComponents/button";
import FormControl from "@/components/formComponents/frmControl";
import { MdCheckBox } from "react-icons/md";
import {BsInputCursorText} from "react-icons/bs"
import { IoRadioButtonOn } from "react-icons/io5";
import FormSelection from "@/components/formComponents/frmSelect";
import { subjectList } from "@/lib/constants";
import { getFilteredSubjects } from "@/lib/helpers";

export default function MainSideBar({addQuiz,formData,handleChange}){
     return <>
          <p className="label">Հարցի Տեսակներ</p>
          <div className="elems">
               <Button btnStyle="outline-blue sidebar-elem mt" onClick={()=>addQuiz('pick-one')}><MdCheckBox />Նշելով</Button>
               <Button btnStyle="outline-blue sidebar-elem mt" onClick={()=>addQuiz('text-answer')}><BsInputCursorText /> Գրավոր</Button>
               <Button btnStyle="outline-blue sidebar-elem mt" onClick={()=>addQuiz('true-false')}><IoRadioButtonOn /> Այո և Ոչ</Button>
          </div>
          <FormControl type="textarea" name="description" title="Նկարագրություն" value={formData.description} onChange={handleChange}/>
          <FormSelection name="visibility" value={formData.visibility} onChange={handleChange} title="Տեսանելի է">
               <option value="" disabled>Ընտրել տեսանելիությունը</option>
               <option value="private">Միայն ինձ համար</option>
               <option value="public">Բոլորի համար</option>
          </FormSelection>
          <FormSelection name="subject" value={formData.subject} onChange={handleChange} title="Առարկա">
               <option value="" disabled>Ընտրել Առարկան</option>
               {getFilteredSubjects(subjectList)?.map((val,i)=><optgroup key={i} label={val.title}>
                    {val.data.map((val,i)=><option key={i} value={val.name}>{val.title}</option>)}
               </optgroup>)}
          </FormSelection>
     </>
}