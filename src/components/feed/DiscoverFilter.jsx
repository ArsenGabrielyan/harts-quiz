import { useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Button from "../formComponents/button";

export default function DiscoverFilter({children}){
     const [showFirstIcon, setShowFirstIcon] = useState(false);
     const [showLastIcon, setShowLastIcon] = useState(true)
     const tabsRef = useRef(null);
     const handleClickOnIcons = type => {
          tabsRef.current.scrollLeft += type==='left' ? -350 : 350;
          const scrollVal = Math.round(tabsRef.current.scrollLeft);
          const maxScroll = tabsRef.current.scrollWidth - tabsRef.current.clientWidth;
          setShowFirstIcon(scrollVal>0);
          setShowLastIcon(maxScroll > scrollVal)
     }
     return <div className="draggable-tab">
          {showFirstIcon && <div className="icon"><Button customClass="icon-content" onClick={()=>handleClickOnIcons('left')}><MdChevronLeft /></Button></div>}
          <ul className="tabs" ref={tabsRef}>{children}</ul>
          {showLastIcon && <div className="icon"><Button customClass="icon-content" onClick={()=>handleClickOnIcons('right')}><MdChevronRight /></Button></div>}
     </div>
}