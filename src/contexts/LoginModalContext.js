import { createContext, useState } from "react";

export const LoginModalContextShow = createContext();

function LoginModalContext({children}) {
    const [loginModalVisible, setLoginModalVisible] = useState(false)
    const toggleLoginModalVisible = () => {
        setLoginModalVisible(!loginModalVisible);
    }
    const value = {loginModalVisible, toggleLoginModalVisible}
    return ( 
        <LoginModalContextShow.Provider value = {value} >
            {children}
        </LoginModalContextShow.Provider>
    );
}

export default LoginModalContext
