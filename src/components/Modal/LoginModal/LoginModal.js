import classNames from "classnames/bind";
import styles from './LoginModal.module.scss';
import {BiShowAlt, BiHide} from 'react-icons/bi';
import {AiOutlineWarning,AiOutlineCheck} from 'react-icons/ai';

import { useState } from "react";
import Button from "./../../Button";

const cx = classNames.bind(styles);

function LoginModal({navigationAction}) {
    const[showPassword, setShowPassword] = useState(false)
    const toggleShowPassword = () => {setShowPassword(!showPassword)}
    // This is used to check the password is whether passed all the requirements
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('')
    
    const [isEmailNotValidated, setIsEmailNotValidated] = useState(false)
    
    const [isNotValidPwdLength, setIsNotValidPwdLength] = useState()
    const [isNotValidPwdCharacters, setIsNotValidPwdCharacters] = useState()

    const [showDescription, setShowDescription] = useState(false)
    const [showWarning, setShowWarning] = useState(false)

    // Validation
    
    const handleEmailValueChange = (e) => {
        const emailValue = e.target.value;
        
        if (!emailValue.startsWith(' ')) {
            setEmailValue(emailValue);
        }
        else{
            setIsEmailNotValidated(false)
            return;
        }
        validateEmail(emailValue)
    };

    const handlePasswordValueChange= (e) =>{
        const passwordValue = e.target.value;
        if(!passwordValue.startsWith(' ')){
            setPasswordValue(passwordValue)
        }
        if(passwordValue.trim() === ""){
            setIsNotValidPwdCharacters(false)
            setIsNotValidPwdLength(false)
            setShowWarning(false)

            return;
        }
        validatePassword(passwordValue)
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
        e.preventDefault();
    };


    // Validation for password:
    const validatePassword = (value) => {
        const isValidPasswordCharacters = (password) =>{
            const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/.test(password)
            return validPassword            
        }

        if((value.length <8) || (value.length > 20)){
            setIsNotValidPwdLength(true)

        }
        else{
            setIsNotValidPwdLength(false)

        }
        
        const result  = isValidPasswordCharacters(value)
        if(result === false){
            setIsNotValidPwdCharacters(true)

        }
        else{
            setIsNotValidPwdCharacters(false)
        }
    }

    const handleFocus = () => {
        setShowDescription(true)
    }

    const handleBlur = () => {
        if(passwordValue.trim() === ""){
            setShowDescription(false)
            setIsNotValidPwdCharacters()
            setIsNotValidPwdLength()
            setShowWarning(false)
        }
        if(!(passwordValue.trim() === '')){
            if(isNotValidPwdCharacters){
                setShowWarning(true)
            }
            if(isNotValidPwdLength){
                setShowWarning(true)
            }
        }

    }

    const navigateToResetPassword = () => {
        console.log("Login clicked")
        navigationAction(true)
    }
    return ( 
        <div className = {cx('loginModalWrapper')}>    
            <div className = {cx('loginModalContainer')}>
                <h2 className = {cx('loginTitle')}>Log in</h2>
                <form onSubmit={validateAndSubmitForm}>
                    <div className = {cx('formGroup')}>
                        <label htmlFor="email" className = {cx('formLabel')}>Email</label>
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
                            className = {cx('inputContainer')} 
                            name="password"  placeholder='Password' 
                            type={showPassword ? "text" : "password"}
                            value = {passwordValue}
                            onChange={handlePasswordValueChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />             
                        <div className= {cx('iconContainer')} onClick = {toggleShowPassword}>
                            {(isNotValidPwdLength || isNotValidPwdCharacters) && <AiOutlineWarning  className = {cx('warningIcon')}/>}
                            <div className= {cx('showIconBtnContainer')} onClick = {toggleShowPassword}>
                                {showPassword? <BiShowAlt className= {cx('showIconBtn')}/> : <BiHide className= {cx('showIconBtn')}/>}
                            </div>               
                        </div>
                        {showDescription === true &&
                        <div className={cx('descriptionTitleContainer')}>
                        <p className={cx('descriptionTitle')}> Your password must have:</p>
                        <div className= {cx('textContainer', `${isNotValidPwdLength === false && 'active'}`, `${isNotValidPwdLength & showWarning && 'warning'}`)}>
                            <AiOutlineCheck className={cx('checkIcon')}/>
                            <span>8 to 20 characters</span>
                        </div>

                        <div type = 'success' className= {cx('textContainer', `${isNotValidPwdCharacters === false && 'active'}`,`${isNotValidPwdCharacters& showWarning && 'warning'}`)}>
                            <AiOutlineCheck className={cx('checkIcon')}/>
                            <span>Letters, numbers, and special characters</span>
                        </div>
                    </div>}

                    </div>
                    <Button text className = {cx('resetPasswordBtn')}  onClick = {navigateToResetPassword}>Forgot password?</Button>

                    <button type="submit" disabled className={cx('logInBtn')}>Log in</button>
                </form>
            </div> 

            
        </div>    
    );
}

export default LoginModal;