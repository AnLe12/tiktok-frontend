import classNames from 'classnames/bind';
import styles from './EditProfileModal.module.scss';

import Button from './../../../components/Button';
import Image from './../../../components/Image'

import * as authenticationService from './../../../services/authenticationService';

import {AiOutlineClose} from 'react-icons/ai';
import {CiEdit} from 'react-icons/ci'

import {useState,useEffect, useContext} from 'react';
import * as loggedInUser from './../../../utils/loggedInUser' 
import {NotificationContextShow} from '../../../contexts/NotificationContext';

const cx = classNames.bind(styles)
function EditProfileModal({closeEditProfileModal, loggedInUserData}) {
    const accessToken = loggedInUser.getToken();
    const [avaInput, setAvaInput] = useState(loggedInUserData?.avatar)
    const [lastNameInput, setLastNameInput] = useState(loggedInUserData?.last_name)
    const [firstNameInput, setFirstNameInput] = useState(loggedInUserData?.first_name)
    const [nicknameInput, setNicknameInput] = useState(loggedInUserData?.nickname)
    const [bioInput, setBioInput] = useState(loggedInUserData?.bio)

    const [isNicknameValid, setIsNicknameValid] = useState(true)

    const [,setNotification] = useContext(NotificationContextShow)


    useEffect(() => {
        return () =>{
            avaInput && URL.revokeObjectURL(avaInput.preview)
        }
    },[avaInput])

    const validateNickname = (nickname) => {
        const result = /^[0-9A-Za-z_.]+$/.test(nickname)
        if(nickname.startsWith(' ')){
            return false
        }
        else{
            return result
        }
    }
    const handlePreviewAvatar = (e) => {
        const fileInput = e.target.files[0]
        // create an attribute for the variable avaInput
        fileInput.preview = URL.createObjectURL(fileInput)
        setAvaInput(fileInput)       

    }
    
    const handleLastNameInput = (e) => {
        const userInput = e.target.value;
        setLastNameInput(userInput)
    }
    const handleFirstNameInput = (e) => {
        const userInput = e.target.value;
        setFirstNameInput(userInput)
    }
    const handleNicknameInput = (e) => {
        const userInput = e.target.value;
        setNicknameInput(userInput)
        const isValid = validateNickname(userInput)
        if(isValid){
            setIsNicknameValid(true)
        }
        else{
            setIsNicknameValid(false)
        }
        
    }
    const handleBioInput = (e) => {
        const userInput = e.target.value;
        setBioInput(userInput)
    }

    const disabledSaveBtn = () => {
        if(avaInput !== loggedInUserData.avatar ||
            lastNameInput !== loggedInUserData.last_name ||
            firstNameInput !== loggedInUserData.first_name ||
            nicknameInput !== loggedInUserData.nickname ||
            bioInput !== loggedInUserData.bio
        ){
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // For sending imgae:
        const formData = new FormData();
        formData.append("file", avaInput);
        formData.append("filename", avaInput.name);
        var avaParam
        if(avaInput !== loggedInUserData.avatar){
            avaParam = formData.get("file");
        }

        const data = {
            avatar: avaParam,
            last_name: lastNameInput,
            first_name: firstNameInput,
            nickname: nicknameInput,
            bio: bioInput
            }
        authenticationService.updateCurrentUser(data, accessToken)
            .then((result) => {
                const data = {data: result.data,
                              meta:  JSON.parse(localStorage.getItem( 'user' ))['meta'] }
                // Update the result user for local storage here
                localStorage.setItem('user', JSON.stringify(data))
                setNotification('Update profile successfully')
                closeEditProfileModal()
                window.location.reload()
            })
        
    }
    return (  
    <div className = {cx('wrapper')}>
        <div className = {cx('modalContainer')}>
            <div className = {cx('modalHeader')}>
                <div className = {cx('modalHeaderTitle')}>Edit Profile</div>
                <div className = {cx('modalCloseBtnContainer')} >
                    <AiOutlineClose className = {cx('closeBtn')} onClick = {() =>closeEditProfileModal()}/>
                </div> 
            
            </div>
            <div className = {cx('modalBody')}> 
                <div className = {cx('itemContainer')}>
                    <div className = {cx('itemLabel')}>
                        Profile photo
                    </div>
                    <div className = {cx('itemContent', 'avatarContainer')}>
                        <Image className = {cx('userAvatar')} large src={avaInput.preview || loggedInUserData.avatar} alt={loggedInUserData.nickname} />
                        <div className = {cx('editAvaContainer')}>
                            <input type="file" accept=".jpg,.jpeg,.png" className = {cx('avatarInput')} onChange = {handlePreviewAvatar}></input>
                            <CiEdit className = {cx('editAvaIcon')}/>
                        </div>
                    </div>
                </div>
                <div className = {cx('itemContainer')}>
                    <div className = {cx('itemLabel')}>
                        Last name
                    </div>
                    <div className = {cx('itemContent')}>
                        <input 
                            type='text'
                            name='lastName'
                            placeholder="Your last name" 
                            className={cx('userInputText')} 
                            value={lastNameInput}
                            onChange = {handleLastNameInput}
                        />                        
                    </div>
                </div>
                <div className = {cx('itemContainer')}>
                    <div className = {cx('itemLabel')}>
                        First name
                    </div>
                    <div className = {cx('itemContent')}>
                        <input 
                            placeholder="Your first name" 
                            className={cx('userInputText')} 
                            value=  {firstNameInput}
                            onChange = {handleFirstNameInput}
                        />                        
                        
                    </div>
                </div>

                <div className = {cx('itemContainer')}>
                    <div className = {cx('itemLabel')}>
                        Nick name
                    </div>
                    <div className = {cx('itemContent')}>
                        <input 
                            placeholder="Your nick name" 
                            className={cx('userInputText', `${!isNicknameValid && 'warningInput'}`)} 
                            value=  {nicknameInput}
                            onChange = {handleNicknameInput}
                        /> 
                        {!isNicknameValid && <p className={cx('warning')}>This username isn’t available. Please enter a new one.</p>}                   
                        <p className = {cx('profileUserLink')}>www.tiktok.com/@{nicknameInput}</p>
                        <p className = {cx('profileUserTip')}>Usernames can only contain letters, numbers, underscores, and periods. Changing your username will also change your profile link.</p>

                    </div>
                </div>
                <div className = {cx('itemContainer', 'noBorder')}>
                    <div className = {cx('itemLabel')}>
                        Bio
                    </div>
                    <div className = {cx('itemContent')}>
                        <textarea 
                            type="text"
                            placeholder="Bio" 
                            className={cx('userInputTextArea')}
                            value = {bioInput}
                            onChange={handleBioInput}
                        >
                        </textarea>                      
                        <div className = {cx('textCount')}>0/80</div>
                        
                    </div>
                </div>
                
            
            </div>
            <div className = {cx('footerContainer')}>
                <Button className = {cx('cancelBtn')} outline small onClick = {() =>closeEditProfileModal()}>Cancel</Button>
                <Button className = {cx('saveBtn')} disabled = {disabledSaveBtn()} small primary onClick={handleSubmit}>Save</Button>
            </div>
        </div>
    </div>);
}
export default EditProfileModal;
