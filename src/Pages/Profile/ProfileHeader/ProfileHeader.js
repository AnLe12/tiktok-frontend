import classNames from "classnames/bind";
import styles from './ProfileHeader.module.scss';

import {AiFillCheckCircle} from 'react-icons/ai'
import {RiShareForwardLine,RiMoreFill} from 'react-icons/ri';
import {BsFacebook,BsWhatsapp,BsTwitter,BsLink45Deg,BsLinkedin,BsReddit,BsTelegram,BsFlag} from 'react-icons/bs';
import {ImEmbed} from 'react-icons/im';
import {CiEdit} from 'react-icons/ci'
import {MdOutlineMailOutline,MdOutlineBlock,MdOutlineMessage} from 'react-icons/md';
import {SlUserFollowing} from 'react-icons/sl';

import {useContext} from 'react'

import Image from './../../../components/Image'
import PopUpMenu from './../../../components/PopUpMenu';
import Button from './../../../components/Button';
import Modal from './../../../components/Modal';
import EditProfileModal from './../../../components/Modal/EditProfileModal';

import  {ModalContextShow} from '../../../contexts/ModalContext';

// For react-loading-skeleton
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'


const cx = classNames.bind(styles)
const SHARE_ITEMS = [
    {
        icon: <ImEmbed />,
        title: 'Embed',
    },
    {
        icon: <BsFacebook />,
        title: 'Share to Facebook',
    },
    {
        icon: <BsWhatsapp />,
        title: 'Share to WhatsApp',
    },
    {
        icon: <BsTwitter />,
        title: 'Share to Twitter',
    },
    {
        icon: <BsLink45Deg />,
        title: 'Copy Link',
    },
    {
        icon: <BsLinkedin />,
        title: 'Share to LinkedIn',
    },
    {
        icon: <BsReddit />,
        title: 'Share to Reddit',
    },
    {
        icon: <BsTelegram />,
        title: 'Share to Telegram',
    },
    {
        icon: <MdOutlineMailOutline />,
        title: 'Share to Email',
    },
    
    
];

const MORE_ACTIONS = [
    {
        icon: <MdOutlineMessage />,
        title: 'Send message',
    },
    {
        icon: <BsFlag />,
        title: 'Report',
    },
    {
        icon: <MdOutlineBlock />,
        title: 'Block',
    }
];

function ProfileHeader({ viewOwnProfile, viewUserData,loggedInUserData}) { 
    
    const modalContext = useContext(ModalContextShow)
    const toggleModalVisible =() => {
        modalContext.toggleModalVisible()
    }
    
    return ( 
        <div className={cx('header')}>
            <div className={cx('userInfo')}>
                <div className={cx('userAvatarContainer')}>
                    <Image className = {cx('userAvatar')} large src={viewUserData?.avatar} alt={viewUserData?.nickname} />
                </div>
                <div className={cx('userTitleContainer')}>
                    <h1 className={cx('userTitle')}>
                        {viewUserData?.first_name} {viewUserData?.last_name} 
                        <div>
                        {viewUserData?.tick && <AiFillCheckCircle className={cx('userStar')} />}
                    </div>
                    </h1>
                    <h2 className={cx('userSubtitle')}>{viewUserData?.nickname}</h2>
                    {viewOwnProfile ?
                        (<Button className={cx('editProfileBtn')} onClick= {toggleModalVisible}>
                            <CiEdit className={cx('editProfileIcon')}/>
                            Edit profile
                        </Button>)
                        :
                        (<>
                            {viewUserData?.is_followed ? 
                                (<div className={cx('followedContainer')}>
                                    <Button outline className={cx('messageBtn')}>Messages</Button>
                                    <Button outline className={cx('unFollowBtn')}>
                                        <SlUserFollowing />
                                        <span className={cx('tooltiptext')}>Unfollow</span>
                                    </Button>
                                    
                                </div>)
                                :
                                (<Button primary className={cx('followBtn')}>Follow</Button>)
                            }
                        </>  )
                    }

                    
                </div>
            </div>
            {modalContext.modalVisible === true && (
                <div className={cx('modalWrapper')}>
                    <Modal>
                        <EditProfileModal closeEditProfileModal = {toggleModalVisible} loggedInUserData = {loggedInUserData}></EditProfileModal> 
                    </Modal>
                </div>
            )}
            <div className={cx('userCountInfosContainer')}>
                <div className={cx('userCountInfos')}>
                    <div className={cx('item')}>
                        <strong className={cx('value')}>{viewUserData?.followings_count}</strong>
                        <span className={cx('label')}>Following</span>
                    </div>
                    <div className={cx('item')}>
                        <strong className={cx('value')}>{viewUserData?.followers_count}</strong>
                        <span className={cx('label')}>Followers</span>
                    </div>
                    <div className={cx('item')}>
                        <strong className={cx('value')}>{viewUserData?.likes_count}</strong>
                        <span className={cx('label')}>Likes</span>
                    </div>
                </div> 
                {!!viewUserData?.bio ? <p className={cx('userBio')}>{viewUserData?.bio}</p> : <p>No bio yet.</p>}
            </div>
            <div className={cx('shareBtnContainer')}>
                <RiShareForwardLine className={cx('shareBtn')}/>
                <div className={cx('popUpShareItemsList')}>
                    <PopUpMenu  items = {SHARE_ITEMS} type= 'menu'/>
                </div>
            </div>
            <div className={cx('moreActionsContainer')}>
                <RiMoreFill className={cx('moreActionsBtn')}/>
                <div className={cx('popUpMoreActionsList')}>
                    <PopUpMenu  items = {MORE_ACTIONS} type= 'menu'/>
                </div>
            </div>

        </div>
     );
}

export default ProfileHeader;