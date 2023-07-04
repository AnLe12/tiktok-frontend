import classNames from "classnames/bind";
import styles from './SignUpModal.module.scss';
import { useState, useContext,} from "react";
import {BiShowAlt, BiHide} from 'react-icons/bi';
import {AiOutlineWarning,AiOutlineCheck,} from 'react-icons/ai';

import MonthDropDown from "./MonthDropDown";
import DayDropDown from "./DayDropDown";
import YearDropDown from "./YearDropDown";


import * as loggedInUser from './../../../../utils/loggedInUser'
import * as authorizationService from '../../../../services/authorizationService'

import {NotificationContextShow} from '../../../../contexts/NotificationContext';


const cx = classNames.bind(styles);

function SignUpModal() {
    const [showPassword, setShowPassword] = useState(false)
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('')
    
    const [isEmailNotValidated, setIsEmailNotValidated] = useState()
    
    const [isNotValidPwdLength, setIsNotValidPwdLength] = useState()
    const [isNotValidPwdCharacters, setIsNotValidPwdCharacters] = useState()

    const [showDescription, setShowDescription] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    
    const toggleShowPassword = () => {setShowPassword(!showPassword)}

    const [,setNotification] = useContext(NotificationContextShow)


    // Validation
    
    const handleEmailValueChange = (e) => {
        const emailValue = e.target.value;
        
        if (!emailValue.startsWith(' ')) {
            setEmailValue(emailValue);
        }
        else{
            setIsEmailNotValidated(true)
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
            setIsNotValidPwdCharacters(true)
            setIsNotValidPwdLength(true)
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
        if (isEmailNotValidated || isNotValidPwdLength || isNotValidPwdCharacters){
            console.log('Invalid Entry');
            return;
        }
        
        try{
            authorizationService.signUp('email',  emailValue, passwordValue )
                .then((data) =>{
                    if (data.meta && data.meta.token) {
                        loggedInUser.saveUser(data);
                        setNotification('Sign up successfully')
                        window.location.reload();
                    } 
                })
            
        }
        catch(event) {
            console.log(event)
        }
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

    const handlePwdInputBlur = () => {
        
        if(passwordValue.trim() === ""){
            setShowDescription(false)
            setIsNotValidPwdCharacters(undefined)
            setIsNotValidPwdLength(undefined)
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
    const handleEmailInputBlur = () => {
        if(emailValue.trim() ===''){
            setIsEmailNotValidated();
            
        }
    }

    
    return ( 
        <div className={cx('signUpWrapper')}>
            <div className = {cx('signUpContainer')}>
                <h2 className = {cx('title')}>Sign up</h2>
                <form onSubmit={validateAndSubmitForm}>
                <div className = {cx('formGroup')}>
                    <label  className = {cx('formLabel')}>When's your birthday?</label>
                    <div className = {cx('birthdayContainer')}> 
                        <MonthDropDown/>

                        <DayDropDown/>

                        <YearDropDown/>
                    </div>                    
                </div>
                <label htmlFor="email" className = {cx('formLabel')}>Email</label>
                <div className = {cx('formGroup')}>
                    <input 
                        id = 'email' 
                        className = {cx('inputContainer', `${isEmailNotValidated && 'warning'}`) } 
                        name="email" type="text"
                        value={emailValue}
                        onChange={handleEmailValueChange} 
                        placeholder="Example: user@gmail.com"
                        onBlur = {handleEmailInputBlur}

                    />             
                    <div className = {cx('iconContainer')}>
                        {isEmailNotValidated && <AiOutlineWarning className = {cx('warningIcon')}/>}
                    </div>
                </div>
                {isEmailNotValidated === true &&
                    <div className= {cx('textWarningContainer')}>
                        <span>Enter a valid email address</span>
                    </div>
                }

                <div className = {cx('formGroup')}>
                    <input 
                        id = 'password' 
                        className = {cx('inputContainer')} 
                        name="password"  
                        placeholder='Password' 
                        type={showPassword ? "text" : "password"}
                        value = {passwordValue}
                        onChange={handlePasswordValueChange}
                        onFocus={handleFocus}
                        onBlur={handlePwdInputBlur}
                    />             
                    <div className= {cx('iconContainer')}>
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

                        <div type = 'success' className= {cx('textContainer', `${isNotValidPwdCharacters === false && 'active'}`,`${isNotValidPwdCharacters & showWarning && 'warning'}`)}>
                            <AiOutlineCheck className={cx('checkIcon')}/>
                            <span>Letters, numbers, and special characters</span>
                        </div>
                    </div>}
                </div>

                <div className = {cx('formGroup')}>
                        <input  className = {cx('inputContainer')} placeholder='Enter 6-digit code' type="text" />             
                        <div className= {cx('sendCodeWrapper')} >
                            <button className={cx('sendCodeBtn')}>Send code</button>
                        </div>
                    </div>
                            
                <button type="submit" disabled = {(isEmailNotValidated || isNotValidPwdCharacters || isNotValidPwdLength ||
                     isEmailNotValidated=== undefined|| isNotValidPwdCharacters === undefined || isNotValidPwdLength === undefined)} className={cx('signUpBtn')}>Sign up</button>

                </form>
            </div> 

            <div className = {cx('policyConfirmTips')}>
                <p>By continuing, you agree to TikTok’s
                    <a href='https://www.tiktok.com/legal/terms-of-use?lang=en" class="tiktok-1w6usl4-ALink e1sbfgbz2' className={cx('tiktokLink')}> Terms of Service </a>
                     and confirm that you have read TikTok’s <a href='https://www.tiktok.com/legal/privacy-policy?lang=en' className={cx('tiktokLink')}> Privacy Policy</a>.</p>
            </div>


            
        </div>
    );
}

export default SignUpModal;