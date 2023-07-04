import classNames from "classnames/bind";
import styles from './Sidebar.module.scss';
import PropTypes from "prop-types";

import Button from '../Button';
import {BsFillHouseDoorFill, BsPeople} from 'react-icons/bs';
import {RiLiveLine} from 'react-icons/ri';

// import UserList from '../UserList';
import UserItem from '../UserList/UserItem';

import DiscoverList from './DiscoverList';
import Privacy from '../Privacy';
import { useEffect, useState } from "react";

import * as userService from './../../services/userService'
import config from '../../config'

import { useContext } from 'react';
import {LoginModalContextShow} from '../../contexts/LoginModalContext';

import * as loggedInUser from './../../utils/loggedInUser'


const cx = classNames.bind(styles);

function Sidebar({className}) {
    const DISCOVER = [{
        discover: 'Filtok',
        type: 'music',
    },

    {
        discover: 'mimchong',
        type: 'tag',
    },

    {
        discover: 'holi',
        type: 'music',
    },

    {
        discover: ' Where is d All the Time Go? - Dr. Dog',
        type: 'music',
    },

    {
        discover: 'holi',
        type: 'tag',
    },

    {
        discover: ' La Esmeralda, Act 1, Esmeralda Variation - MetodoVadimdfalf',
        type: 'music',
    },

    {
        discover: 'Nhu',
        type: 'tag',
    },

]

    const loginModalContext = useContext(LoginModalContextShow)
    const [totalSuggestPages, setTotalSuggestPages] = useState()
    const [currentSuggestPage, setCurrentSuggestPage] = useState(1);
    const [suggestAccount, setSuggestAccount] = useState([])


    const [totalFollowingPages, setTotalFollowingPages] = useState()
    const [currentFollowingPage, setCurrentFollowingPage] = useState(1);
    const [followingAccounts, setFollowingAccounts] = useState([])

    const [changePage, setChangePage] = useState('forYou')
    const accessToken = loggedInUser.getToken()

    const classes  = cx('wrapper', {
        [className]: className,});

     

    useEffect(() =>{
        const fetchAPI = async() =>{
            userService.getSuggestAccount(currentSuggestPage)
                .then((result) =>{
                    setSuggestAccount( [...suggestAccount,...result.data])
                    setTotalSuggestPages(result.meta.pagination.total_pages)
                }
            )
        }
        fetchAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentSuggestPage]);

    useEffect(() =>{
        if(!accessToken){
            return
        }
        userService.getFollowUsers(currentFollowingPage, accessToken)
            .then((result)  =>{
                setFollowingAccounts( [...followingAccounts, ...result.data])
                setTotalFollowingPages(result.meta.pagination.total_pages)
            })
            .catch((error) => console.log(error))
        

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentFollowingPage,accessToken]);

    return ( 
    <aside className={classes}>

        <nav className= {cx('navContainer')}>
            <Button 
                className={cx('navBtn')} 
                large 
                leftIcon = {<BsFillHouseDoorFill className={cx('navBtn-icon')} />} 
                to={config.routes.home} 
                active = {changePage === 'forYou'}
                onClick={() => setChangePage('forYou')}
            >
                <span className={cx('navBtnLabel')}>For You</span>
            </Button>

            <Button 
                className={cx('navBtn')} 
                large leftIcon = {<BsPeople className={cx('navBtn-icon')} />} 
                to={config.routes.following}
                active = {changePage === 'following'}
                onClick={() => setChangePage('following')}
            >
                    <span className={cx('navBtnLabel')}>Following</span>
            </Button>
            
            <Button 
                className={cx('navBtn')} large 
                disabled 
                leftIcon = {<RiLiveLine className={cx('navBtn-icon')}/>}
            >
                <span className={cx('navBtnLabel')}>LIVE</span>
            </Button>

        </nav>

        {!accessToken && 
            <div className = {cx('frameContainer')}>
                <p className={cx('text')}>Log in to follow creators, like videos, and view comments.</p>
                <Button outline large className= {cx('logInBtn')} onClick={loginModalContext.toggleLoginModalVisible}>Log in</Button>
            </div>
            
        }
        
        {accessToken && followingAccounts.length > 0 ?
            <div>
                <div className = {cx('userContainer')}>
                    <h4 className={cx('header')}>Following accounts</h4>
                    <div className={cx('userList')}>
                        {Array.isArray(followingAccounts) && followingAccounts.map((account , index) => {
                            return (
                                <UserItem key={index} data={account} />
                            )
                        })}
                    </div>
                    {currentFollowingPage < totalFollowingPages? 
                        <Button className={cx('seeAllBtn')} onClick = {() =>{setCurrentFollowingPage(currentFollowingPage + 1)}} text>
                            See more
                        </Button>
                    :
                        <Button className={cx('seeAllBtn')} onClick = {() =>{setCurrentFollowingPage(1); setFollowingAccounts([])}} text>
                            See less
                        </Button>
                    }
                </div>
            </div>
        :
            <div>
                <div className = {cx('userContainer')}>
                    <h4 className={cx('header')}>Suggested accounts</h4>
                    <div className={cx('userList')}>
                        {Array.isArray(suggestAccount) && suggestAccount.map((account, index  ) => {
                            return(
                                <UserItem key={index}  data={account} />
                            )
                        })}
                    </div>
                    {currentSuggestPage < totalSuggestPages? 
                        <Button className={cx('seeAllBtn')} onClick = {() =>{setCurrentSuggestPage(currentSuggestPage + 1)}} text>
                            See more
                        </Button>
                    :
                        <Button className={cx('seeAllBtn')} onClick = {() =>{setCurrentSuggestPage(1); setSuggestAccount([])}} text>
                            See less
                        </Button>
                    }
                </div>
                <div className = {cx('discoverContainer')}>
                    <h4 className={cx('header')}>Discover</h4>
                    <div className={cx('discoverList')}>
                        <DiscoverList items={DISCOVER}/>
                    </div>
                </div>

            </div>
        
        
        }
        <div className = {cx('footerContainer')}>
            <Privacy />
        </div>
    </aside> );
}

Sidebar.prototype ={
    classNames: PropTypes.string,
}

export default Sidebar;