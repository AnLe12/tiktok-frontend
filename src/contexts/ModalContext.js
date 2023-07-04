import { createContext, useState } from "react";

export const ModalContextShow = createContext();

function ModalContext({children}) {
    const [modalVisible, setModalVisible] = useState(false)
    const toggleModalVisible = () => {
        setModalVisible(!modalVisible);
    }
    const value = {modalVisible, toggleModalVisible}
    return ( 
    <ModalContextShow.Provider value = {value} >
        {children}
    </ModalContextShow.Provider>
    );
}

export default ModalContext;
