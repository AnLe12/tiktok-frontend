import { AiOutlineCheck,} from 'react-icons/ai';
import {RiArrowDownSFill,} from 'react-icons/ri';
import classNames from "classnames/bind";
import styles from './../SignUpModal.module.scss'

import { useEffect, useState, useRef } from "react";

const cx = classNames.bind(styles);
function MonthDropDown() {
    const monthList = [
        {
            item: 'January',
        },
        {
            item: 'February',
        },
        {
            item: 'March',
        },
        {
            item: 'April',
        },

        {
            item: 'May',
        },

        {
            item: 'June',
        },

        {
            item: 'July',
        },

        {
            item: 'August',
        },

        {
            item: 'September',
        },

        {
             item: 'October',
        },

        {
             item: 'November',
        },

        {
             item: 'December',
        },

    ]

    const [visibility, setVisibility] = useState(false)
    const showMonthDropDown=() => {setVisibility(!visibility)}
    const monthRef = useRef()
    useEffect(() => {
        document.addEventListener('mousedown', (event) => {
            if(!monthRef?.current?.contains(event.target)){
                setVisibility(false)
            }
            }
        )
    })

    const [selectedValue, setSelectedValue] = useState("");

    const handleSelect = (item) => {
        setSelectedValue(item);
        setVisibility(false);
      }

    return ( 
        <div className = {cx('monthListBox')} onClick = {showMonthDropDown} ref={monthRef}>
            <div className = {cx('selectLabel')}>
                {(selectedValue === "") ? 'Month': selectedValue}
                <RiArrowDownSFill className={cx('iconDropDown')}/>
            </div>
            <ul className = {cx('optionListContainer')} 
                style={{visibility: visibility ? 'visible':'hidden' }}
            >
                {monthList.map((month, index) => { 
                    return (
                    <li className = {cx('optionItem')} key ={index} value={month.item} onClick = {() =>handleSelect(month.item)}>
                        {month.item}
                        {selectedValue === month.item && <AiOutlineCheck className={cx('iconCheck')}/>}

                    </li>
                    )
                })}
            </ul>
        </div>    
    );
}

export default MonthDropDown;