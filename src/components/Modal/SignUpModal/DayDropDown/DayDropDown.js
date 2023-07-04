import { AiOutlineCheck,} from 'react-icons/ai';
import {RiArrowDownSFill,} from 'react-icons/ri';
import classNames from "classnames/bind";
import styles from './../SignUpModal.module.scss'

import { useEffect, useState, useRef } from "react";


const cx = classNames.bind(styles);

function DayDropDown() {
    const dayList = Array.from(new Array(31), (val, index) => index +1)

    const [visibility, setVisibility] = useState(false);
    const showDayDropDown = () =>{
        setVisibility(!visibility);
    }

    const dayRef = useRef()
    useEffect(()=>{
        document.addEventListener('mousedown', (event) =>{
            if(!dayRef?.current?.contains(event.target)){
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
        <div className = {cx('dayListBox')} onClick={showDayDropDown} ref = {dayRef}>
            <div className = {cx('selectLabel')} >
                {(selectedValue === "") ? 'Day': selectedValue}

                <RiArrowDownSFill className={cx('iconDropDown')}/>
            </div>
            <ul className = {cx('optionListContainer')}
                style={{visibility: visibility ? 'visible':'hidden' }}

            >
                {dayList.map((day, index) => {
                    return (
                        <li className = {cx('optionItem')} key={index} value={day} onClick = { () =>handleSelect(day)}>
                            {day}
                            {selectedValue === day && <AiOutlineCheck className={cx('iconCheck')}/>}
                        </li>
                )})
                }
            </ul>
        </div>
);
}

export default DayDropDown;