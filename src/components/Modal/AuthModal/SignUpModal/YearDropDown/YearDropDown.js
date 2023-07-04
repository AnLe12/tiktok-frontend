import { AiOutlineCheck,} from 'react-icons/ai';
import {RiArrowDownSFill,} from 'react-icons/ri';
import classNames from "classnames/bind";
import styles from './../SignUpModal.module.scss'
import { useEffect, useState, useRef } from "react";

const cx = classNames.bind(styles);


function YearDropDown() {
    const year = (new Date()).getFullYear();
    const years = Array.from(new Array(100),(val, index) => year - index);

    const [visibility, setVisibility] = useState(false)
    const showYearDropDown=() => {setVisibility(!visibility)}

    const yearRef = useRef()
    useEffect(() =>{
        document.addEventListener('mousedown', (event)=>{
            if(!yearRef?.current?.contains(event.target)){
                setVisibility(false)
            }
        })
    })

    const [selectedValue, setSelectedValue] = useState("");

    const handleSelect = (item) => {
        setSelectedValue(item);
        setVisibility(false);
      }

    return (  
        <div className = {cx('yearListBox')} onClick = {showYearDropDown} ref= {yearRef}>
            <div className = {cx('selectLabel')} >
            {(selectedValue === "") ? 'Year': selectedValue}
                <RiArrowDownSFill className={cx('iconDropDown')}/>
            </div>
            <ul className = {cx('optionListContainer')}
                style={{visibility: visibility ? 'visible':'hidden' }}

            >
                {years.map((year, index) => {
                    return (
                        <li  className = {cx('optionItem')} key={index} value={year}  onClick = {() =>handleSelect(year)}>
                            {year}
                            {selectedValue === year && <AiOutlineCheck className={cx('iconCheck')}/>}
                        </li>
                    )
                    
                })
                }
            </ul>
        </div>
    );
}

export default YearDropDown;