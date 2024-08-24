import { useMemo, useRef, useState } from "react"
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/tools/firebase";

export default function OrganizationAndPFP({image, id, updateFields}){
     const [imgSrc, setImgSrc] = useState(typeof image!=='string' ? '/default-pfp.png' : image || '/default-pfp.png');
     const [uploadedPercent, setUploadedPercent] = useState(0);
     const [completed, setCompleted] = useState(false)
     const imgRef = useRef(null);
     const handleChange = async e => {
          const pfpRef = ref(storage,`pfps/${id}`);
          const file = e.target.files[0];
          const uploaded = uploadBytesResumable(pfpRef,file);
          uploaded.on('state_changed',snapshot=>{
               setCompleted(false);
               setUploadedPercent((snapshot.bytesTransferred/snapshot.totalBytes)*100)
          },
          err=>console.error(err.message),
          ()=>getDownloadURL(uploaded.snapshot.ref).then(url=>{
               setImgSrc(url)
               updateFields({image: url});
               setCompleted(true)
          }))
     }
     const color = useMemo(()=>completed ? '#22b455' : '#0090ff',[completed])
     return <div className="frmCenter">
          <h2>Նկար</h2>
          <div className="pfp" style={{background: `conic-gradient(from 0deg, ${color} 0%, ${color} 0% ${uploadedPercent}%, #222 ${uploadedPercent}%, #222 100%)`}} onClick={()=>imgRef.current.click()}>
               <p className="overlay">Փոխել Նկարը</p>
               <Image src={imgSrc} alt="pfp" width={200} height={200}/>
               <input type="file" ref={imgRef} onChange={handleChange}/>
          </div>
     </div>
}