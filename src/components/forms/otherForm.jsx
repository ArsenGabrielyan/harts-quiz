import FormControl from "../formComponents/frmControl"
import FormSelection from "../formComponents/frmSelect"
import { subjectList } from "@/lib/constants";
import { getFilteredSubjects } from "@/lib/helpers";

export default function MiscFields({organization, username, favoriteSubject, updateFields}){
     return <>
          <FormControl name="organization" title="Կազմակերպություն" value={organization} onChange={e=>updateFields({organization: e.target.value})}/>
          <FormControl name="username" title="Օգտանուն" value={username} onChange={e=>updateFields({username: e.target.value})}/>
          <FormSelection name="favoriteSubject" title="Ձեր սիրած առարկան" value={favoriteSubject} onChange={e=>updateFields({favoriteSubject: e.target.value})}>
          <option value="" disabled>Ընտրել Առարկան</option>
               {getFilteredSubjects(subjectList)?.map((val,i)=><optgroup key={i} label={val.title}>
                    {val.data.map((val,i)=><option key={i} value={val.name}>{val.title}</option>)}
               </optgroup>)}
          </FormSelection>
     </>
}