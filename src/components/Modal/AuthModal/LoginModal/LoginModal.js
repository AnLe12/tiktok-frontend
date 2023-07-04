import classNames from "classnames/bind";
import styles from './LoginModal.module.scss';

import {BiShowAlt, BiHide} from 'react-icons/bi';
import {AiOutlineWarning,} from 'react-icons/ai';

import { useState,useContext } from "react";
import Button from "./../../../Button";

import * as authenticationService from "../../../../services/authenticationService"
// For token
import * as loggedInUser from './../../../../utils/loggedInUser';

// For notification
import {NotificationContextShow} from '../../../../contexts/NotificationContext';
const cx = classNames.bind(styles);

function LoginModal({navigationAction}) {
    const[showPassword, setShowPassword] = useState(false)
    const toggleShowPassword = () => {setShowPassword(!showPassword)}
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('')
    
    const [isEmailNotValidated, setIsEmailNotValidated] = useState(undefined)

    const [unauthorizedAccess, setUnauthorizedAccess] = useState(false)

    const [,setNotification] = useContext(NotificationContextShow)
    
    const handleEmailValueChange = (e) => {
        const emailValue = e.target.value;
        
        if (!emailValue.startsWith(' ')) {
            setEmailValue(emailValue);
        }
        else{
            setIsEmailNotValidated()
            return;
        }
        validateEmail(emailValue)
    };

    const handlePasswordValueChange= (e) =>{
        const passwordValue = e.target.value;
        if(!passwordValue.startsWith(' ')){
            setPasswordValue(passwordValue)
        }
       
    }
    
    // Validation for email:
    const validateEmail  = (value) => { 
        const result= /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i.test(value);
        if (!result) {
            setIsEmailNotValidated(true)
        }
        else{
            setIsEmailNotValidated(false)
            
        }     
    }

    const validateAndSubmitForm = (e) => {
        e.preventDefault()
        if (isEmailNotValidated || passwordValue.trim() === ""){
            return;
        }
        authenticationService.logIn( emailValue, passwordValue )
            .then((data) => {
                console.log('data: ',data );
                if(!data){
                    setUnauthorizedAccess(true)
                }
                if (data.meta && data.meta.token) {
                    loggedInUser.saveUser(data);
                    
                    setNotification('Log in successfully')
                    
                    window.location.reload()
                } 
            })
            .catch((err) =>{
                console.log(err) 
            }
        )        
    };

    const navigateToResetPassword = () => {
        console.log("Login clicked")
        navigationAction(true)
    }
    return ( 
        <div className = {cx('loginModalWrapper')}>   
            <div className = {cx('loginModalContainer')}>
                <h2 className = {cx('loginTitle')}>Log in</h2>
                <form onSubmit={validateAndSubmitForm}>
                    <label className = {cx('formLabel')}>Email</label>
                    <div className = {cx('formGroup')}>
                        <input 
                            id = 'email' 
                            className = {cx('inputContainer', `${isEmailNotValidated && 'warning'}`)} 
                            name="email" 
                            type="text" 
                            placeholder="Example: user@gmail.com"
                            value={emailValue}
                            onChange={handleEmailValueChange} 
                        />   
                        <div className = {cx('iconContainer')}>
                            {isEmailNotValidated && <AiOutlineWarning className = {cx('warningIcon')}/>}
                        </div>          
                    </div>
                    {isEmailNotValidated &&
                        <div className= {cx('textWarningContainer')}>
                            <span>Enter a valid email address</span>
                        </div>
                    }

                    <div className = {cx('formGroup')}>
                        <input 
                            id = 'password' 
                            className = {cx('inputContainer',`${unauthorizedAccess && 'warning'}`)} 
                            name="password"  placeholder='Password' 
                            type={showPassword ? "text" : "password"}
                            value = {passwordValue}
                            onChange={handlePasswordValueChange}                            
                        />             
                        <div className= {cx('iconContainer')} onClick = {toggleShowPassword}>
                            {( unauthorizedAccess) && <AiOutlineWarning  className = {cx('warningIcon')}/>}
                            <div className= {cx('showIconBtnContainer')} onClick = {toggleShowPassword}>
                                {showPassword? <BiShowAlt className= {cx('showIconBtn')}/> : <BiHide className= {cx('showIconBtn')}/>}
                            </div>               
                        </div>
                        {unauthorizedAccess &&
                            <div className= {cx('unauthorizedAccess')}>
                                <span>Username or password doesn't match our records. Try again.</span>
                            </div>
                        }
                        

                    </div>
                    <Button text className = {cx('resetPasswordBtn')}  onClick = {navigateToResetPassword}>Forgot password?</Button>

                    <button type="submit" disabled = {(isEmailNotValidated  || passwordValue.trim() === "" ||
                     isEmailNotValidated=== undefined)} className={cx('logInBtn')}>Log in</button>
                </form>
            </div> 

            
        </div>    
    );
}

export default LoginModal;