import classNames from 'classnames/bind';
import styles from './Notification.module.scss'

// import {useState, useEffect} from 'react';
import { useContext } from 'react';

import { NotificationContextShow } from '../../contexts/NotificationContext';
const cx = classNames.bind(styles)

function Notification() {
    const [notification] = useContext(NotificationContextShow)
    if(!notification){
        return null
    }

    return (
        <div className={cx('wrapper')}>
            <p className={cx('notificationContent')}>
                {notification}
            </p>
        </div>
        
    );
}


export default Notification;

