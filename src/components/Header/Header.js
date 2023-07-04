// For style className
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import PropTypes from "prop-types";

// For tiktok logo
import images from './../../assets/images';

// For search bar
import SearchBar from './../SearchBar';

// For Button
import Button from './../Button';

// For Pop Up Window
import PopUpMenu from './../PopUpMenu';

import Image from './../Image'
import Modal from './../Modal';
import AuthModal from './../Modal/AuthModal';

import {LoginModalContextShow} from '../../contexts/LoginModalContext';

// For token
import * as loggedInUser from './../../utils/loggedInUser';

import config from '../../config';
import {Link} from 'react-router-dom'
import { useContext } from 'react';



// For icons
import { AiOutlinePlus,AiOutlineSetting} from 'react-icons/ai';
import {GrLanguage, GrKeyboard,GrLogout} from 'react-icons/gr';
import {AiOutlineQuestionCircle} from 'react-icons/ai'
import {MdOutlineDarkMode} from 'react-icons/md';
import {RiMessageLine} from 'react-icons/ri'
import {IoPaperPlaneOutline} from 'react-icons/io5';
import {RxDotsVertical} from 'react-icons/rx';
import {BsPerson,BsCoin} from 'react-icons/bs'
const cx = classNames.bind(styles)

const MENU_ITEMS = [
  {
    type: 'menu',
    icon: <GrLanguage/>,
    title: 'English',
    children: {
      title: 'Language',
      data: [
        {
    
          subType: 'language',
          code: 'en',
          title: 'English',
        },
        {
    
          subType: 'language',
          code: 'vi',
          title: 'Tiếng Việt',
        },

        {
    
          subType: 'language',
          code: 'en',
          title: 'English',
        },
        {
    
          subType: 'language',
          code: 'vi',
          title: 'Tiếng Việt',
        },
      ],
    },
  },
  {
    icon: <AiOutlineQuestionCircle/>,
    title: 'Feedback and help',
    to: '/feedback',
  },
  {
    icon: <GrKeyboard/>,
    title: 'Keyboard shortcuts',
  },
  {   
      icon: <MdOutlineDarkMode/>,
      title: 'Dark mode',
    },
];

const userMenu = [
  {   
    icon: <BsPerson />,
    title: 'View profile',
    to: '/users/minion159123',
  },
  {   
    icon: <BsCoin />,
    title: 'Get coins',
    to: '/coin',
  },
  {   
    icon: <AiOutlineSetting />,
    title: 'Settings',
    to: '/settings',
  },

  ...MENU_ITEMS,
  {   
    icon: <GrLogout />,
    title: 'Log out',
    separate: true,
  },
];

const handlePopUpMenu = ()=> {

}

function Header({className}) {
  const currentUser = loggedInUser.loggedInUser()
  // const currentUser = false;
  const loginModalContext = useContext(LoginModalContextShow)

  const handleMenuchange = (menuItem)=> {
    switch(menuItem.title) {
      case 'Log out':
        loggedInUser.removeToken();
        window.location.reload();
        break;
    default:
        break;
    }
  }
  const classes = cx('inner', className)
    return ( 
        <header className= {cx('wrapper')}>
          <div className={classes}>
            {/* Logo here */}
            <div className={cx('logo')}>
                <Link to = '/'><img src={images.logo} alt='tiktok'/></Link>
                
            </div>

            {/* Search box here */}
            <div className={cx('search')}>
                <SearchBar/>
            </div>
            {currentUser ? (
              <div className={cx('menu')}>
                <Button className={cx('updateBtn')} outline to={config.routes.upload} leftIcon = {<AiOutlinePlus className={cx('updateIcon')}  />} >
                  Upload
                </Button>

                <div className={cx('iconBtnContainer')}>
                  <IoPaperPlaneOutline className={cx('iconBtn')}/>
                  <span className={cx('tooltiptext', 'tooltiptextMsg')}>Messages</span>
                </div>

                <div className={cx('iconBtnContainer')}>
                  <RiMessageLine className={cx('iconBtn')}/>
                  <span className={cx('tooltiptext')}>Inbox</span>
                </div>

                <div className={cx('userNavbar')}>
                  <Image
                    className={cx('userAvatar')}
                    src="https://files.fullstack.edu.vn/f8-prod/user_avatars/1/623d4b2d95cec.png"
                    alt="Nguyen Van A"
                    small
                  />
                  <div className={cx('popUpList')}>
                    <PopUpMenu items = {userMenu} type= 'menu' onChange={handleMenuchange}/>
                  </div>
                </div>
              </div>
            )
            :
            (
              <div className={cx('menu')}>
                <Button className={cx('updateBtn')} outline leftIcon = {<AiOutlinePlus className={cx('updateIcon')} />} >
                  Upload
                </Button>

                <Button primary onClick={loginModalContext.toggleLoginModalVisible} >Log in</Button>
                {loginModalContext.loginModalVisible && (
                  <div className={cx('modalWrapper')}>
                    <Modal>
                      <AuthModal></AuthModal>
                    </Modal> 
                  </div>
                  
                )}
                
                <div className={cx('menuNavbar')}>
                  <RxDotsVertical className={cx('menuNavbarIcon')} onClick= {handlePopUpMenu}/>
                  <div className={cx('popUpList')}>
                    <PopUpMenu  items = {MENU_ITEMS} type= 'menu' onChange={handleMenuchange}/>
                  </div>                      
                </div>  
              </div>

            )}
            
            
          </div>
        </header>
     );
}

Header.prototype = {
  className: PropTypes.string,
}

export default Header;