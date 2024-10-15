import { MdBook, MdPerson } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import Button from "../formComponents/button";

export default function AccountType({accountType, updateFields}){
     const handleCheck = (accType) => updateFields({accountType: accType})
     return <>
          <h2>Հաշվի տեսակ</h2>
          <Button btnStyle={`outline-blue multistep-btn ${accountType==='teacher' ? "active" : ""}`.trim()} onClick={()=>handleCheck("teacher")}><MdBook/> Ուսուցիչ</Button>
          <Button btnStyle={`outline-blue multistep-btn ${accountType==='student' ? "active" : ""}`.trim()} onClick={()=>handleCheck("student")}><FaGraduationCap/> Աշակերտ</Button>
          <Button btnStyle={`outline-blue multistep-btn ${accountType==='personal' ? "active" : ""}`.trim()} onClick={()=>handleCheck("personal")} ><MdPerson/> Անձնական</Button>
     </>
}