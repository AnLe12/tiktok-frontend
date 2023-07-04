import { createContext, useState, useRef, useEffect } from "react";
import Notification from "../components/Notification";

import { createPortal } from 'react-dom';
export const NotificationContextShow = createContext()

function NotificationContext({children}){
    const [notification, setNotification] = useState();
    const timerRef = useRef(null);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setNotification(null);
        }, 2000);
    }, [notification]);

    const NotificationComponent = () => {
        return (
            notification &&
            createPortal(
                    <Notification >
                        {notification}
                    </Notification>,
                document.body
            )
        );
    };

    
    return(
        <NotificationContextShow.Provider value = {[notification, setNotification]}>
            {children}
            <NotificationComponent/>
        </NotificationContextShow.Provider>
    )
}

export default NotificationContext