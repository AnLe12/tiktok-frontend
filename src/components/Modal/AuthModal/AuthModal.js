import classNames from "classnames/bind";
import styles from './AuthModal.module.scss';

import {AiOutlineClose, AiOutlineLeft} from 'react-icons/ai';

import { useContext, useState } from 'react';
import  {LoginModalContextShow} from '../../../contexts/LoginModalContext';

import LoginModal from "./LoginModal";
import ResetPasswordModal from "./ResetPasswordModal";
import SignUpModal from "./SignUpModal";
import Button from "./../../Button/";

const cx = classNames.bind(styles);

function AuthModal(){
    console.log("auth")
    const {toggleLoginModalVisible} = useContext(LoginModalContextShow)
    const [changeModal, setChangeModal] = useState(false) 
    const [toResetPassword, setToResetPassword] = useState(false)   
    
    // const handleClose =() => {
    //     loginModalContext.toggleLoginModalVisible()
    // }
    
    const backToLogin =() => {
        setChangeModal(false)
        setToResetPassword(false)
    }

    const toSignUpModal =() => {
        console.log('clicked')
        setChangeModal(true)
        setToResetPassword(false)
    }
    
    return(
        <div className = {cx('authModalContent')}>
            <div className = {cx('closeBtnWrapper')} onClick ={toggleLoginModalVisible}>
                <AiOutlineClose className = {cx('closeBtn')}/>
            </div>              
            {toResetPassword === true &&
                <div className={cx('backBtnWrapper')} onClick ={backToLogin}>
                    <AiOutlineLeft  className={cx('backBtn')}/>
                </div>
            }    

            {toResetPassword === true ? <ResetPasswordModal/>: changeModal === false ? <LoginModal navigationAction = {setToResetPassword}/>: <SignUpModal/>}                               
    
            {changeModal === true ?
                (
                    <div className={cx('footerAuthModalWrapper')}>
                        <div className={cx('footerAuthModalContainer')}>
                            <div className={cx('bottomText')}>
                                Already have an account?
                            </div>
                            <Button className={cx('logInBtn')} onClick={backToLogin}>Log In</Button>
                        </div>
                    </div>
                )
                :
                (
                    <div className={cx('footerAuthModalWrapper')}>
                        <div className={cx('footerAuthModalContainer')}>
                            <div className={cx('bottomText')}>
                                Don't have an account? 
                            </div>
                            <Button  className={cx('signUpBtn')} onClick= {toSignUpModal}>Sign up</Button>
                        </div>
                    </div>
                )
            }
                
                
            

        </div>
    )
}

export default AuthModal;