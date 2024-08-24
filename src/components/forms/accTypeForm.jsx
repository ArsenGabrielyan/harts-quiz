import FormCheckbox from "../formComponents/frmCheckbox"
import { MdBook, MdPerson } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";

export default function AccountType({accountType, updateFields}){
     const handleChange = e => updateFields({accountType: e.target.value})
     return <>
          <h2>Հաշվի տեսակ</h2>
          <FormCheckbox checked={accountType==='teacher'} type="radio" name="accountType" value="teacher" onChange={handleChange}><MdBook/> Ուսուցիչ</FormCheckbox>
          <FormCheckbox checked={accountType==='student'} type="radio" name="accountType" value="student" onChange={handleChange}><FaGraduationCap/> Աշակերտ</FormCheckbox>
          <FormCheckbox checked={accountType==='personal'} type="radio" name="accountType" value="personal" onChange={handleChange}><MdPerson/> Անձնական</FormCheckbox>
     </>
}