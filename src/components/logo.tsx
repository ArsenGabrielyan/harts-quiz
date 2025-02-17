import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LogoProps{
     width: number,
     height: number
}
export default function Logo({width,height}: LogoProps){
     const {theme} = useTheme()
     const initialImage = theme && theme==="dark" ? "/logos/logo-white.svg" : "/logos/logo.svg";
     const [image, setImage] = useState(initialImage)
     const handleMouseOver = () => setImage("/logos/logo-colorful.svg");
     const handleMouseLeave = () => setImage(initialImage)
     useEffect(()=>{
          setImage(initialImage)
     },[theme])
     return (
          <Link href="/" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
               <Image src={image} alt="Harts" width={width} height={height}/>
          </Link>
     )
}