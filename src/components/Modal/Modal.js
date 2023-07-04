import classNames from "classnames/bind";
import styles from './Modal.module.scss';

// import {AiOutlineClose} from 'react-icons/ai';

// import { useContext, useState } from 'react';
// import { ModalContext } from '../../contexts/ModalContext';

const cx = classNames.bind(styles);

function Modal({children}){  
    return(
        <div className = {cx('wrapper')}>
            <div className = {cx('modalOverlay')}></div>
            {children}
        </div>
    )
}

export default Modal;