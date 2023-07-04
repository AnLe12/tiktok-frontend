// For style className
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';

import * as userService from './../../services/userService';
import * as authenticationService from './../../services/authenticationService';
import * as loggedInUser from './../../utils/loggedInUser';


import {BsLockFill} from 'react-icons/bs';

import Button from './../../components/Button';
import ProfileHeader from './ProfileHeader';
import Notification from '../../components/Notification';

import {BsBookmark} from 'react-icons/bs'
import {IoPersonOutline} from 'react-icons/io5'
import {FiLock} from 'react-icons/fi';


import { VideoModalContextShow } from '../../contexts/VideoModalContext';
import { useContext } from 'react';

const cx = classNames.bind(styles)

function Profile(){
    // For the profile that we look
    const [userProfile, setUserProfile] = useState();
    const nickname = useParams()
    const [videoList, setVideoList] = useState([])
    // const [userLikedVideoList, setUserLikedVideoList] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [likedVideoList, setLikedVideoList] = useState([])

    const [viewOwnProfile, setViewOwnProfile] = useState(false)
    // For containing the data that user who log in - get by sending access token to server
    const [loggedInUserData, setLoggedInUserData] = useState()
    const [playId, setPlayId] = useState(0);

    console.log(playId)

    const userAccessToken = loggedInUser.getToken()
    const savedLocalUser = loggedInUser.loggedInUser()

    const {videoModalVisible, toggleVideoModalVisible, propsOfVideoModal, setPropsOfVideoModal} = useContext(VideoModalContextShow)

    console.log(videoList)

    // console.log(videoModalContext)

    useEffect(() => {
        // For get data from the user whom the logged in user wants to visit by nickname in URL
        const fetchAPI = async () =>{
            userService.getAnUser(nickname.nickname, userAccessToken)
                .then(result =>{ 
                    setUserProfile(result);
                    setVideoList(result.videos);
                })
                .catch(error => console.log(error))
            
        }
        const getCurrentUser = async () =>{
            authenticationService.getCurrentUser(userAccessToken)
                .then(result =>{ 
                    setLoggedInUserData(result.data)
                })
                .catch(error => console.log(error))
        }
        // Run the functions
        
        
        // Check whether the user for visiting is the logged in user
        if(savedLocalUser!== null && nickname.nickname === savedLocalUser?.nickname){
            setViewOwnProfile(true)
            getCurrentUser()    

        }
        else{
            setViewOwnProfile(false)
        }
        fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[nickname])

    // eslint-disable-next-line no-unused-vars
    const [privateLikedVideo, setPrivateLikedVideo] = useState(true); //Set in Setting, maybe use in global
    // eslint-disable-next-line no-unused-vars
    const [privateFavoriteVideo, setPrivateFavoriteVideo] = useState(true)
    
    const [navigation, setNavigation] = useState('videos');


    const videoRef = useRef([]);

    const playVideo = (index) => {
        const currentVideo =videoRef.current[index];
        var isPlaying = currentVideo.currentTime > 0 && !currentVideo.paused && !currentVideo.ended 
        && currentVideo.readyState > currentVideo.HAVE_CURRENT_DATA;

        if (!isPlaying) {
            videoRef.current[index].play();
        }
    };

    const pauseVideo = (index) => {
        videoRef.current[index].pause();
    }

    const handleOpenVideoModal = (video, index) => {
        console.log(123)
        const newProps = {
            video: video,
            videoId: video.id,
            indexOfVideo: index
        }
        setPlayId(index);
        setPropsOfVideoModal(newProps)
        toggleVideoModalVisible()
    }

    useEffect(() => {
        if (videoModalVisible) {
            propsOfVideoModal.handleNextVideo = handleNextVideo;
            propsOfVideoModal.handlePrevVideo = handlePrevVideo;

            setPropsOfVideoModal({ ...propsOfVideoModal });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoModalVisible]);

    const handleNextVideo = () => {
        setPlayId((currentId) => {
            if (currentId >= videoList.length - 1) {
                return currentId;
            } else {
                const nextId = currentId + 1;
                const newProps = {
                    video: videoList[nextId],
                    videoId: videoList[nextId].id,
                    indexOfVideo: nextId,
                };
                setTimeout(() => setPropsOfVideoModal({ ...propsOfVideoModal, ...newProps }));
                return nextId;
            }
        });
    };

    const handlePrevVideo = () => {
        setPlayId((currentId) => {
            if (currentId <= 0) {
                return currentId;
            } else {
                const prevId = currentId - 1;
                const newProps = {
                    video: videoList[prevId],
                    videoId: videoList[prevId].id,
                    indexOfVideo: prevId,
                };
                setTimeout(() => setPropsOfVideoModal({ ...propsOfVideoModal, ...newProps }));
                return prevId;
            }
        });
    };

    return(
        <div className={cx('wrapper')}>
            <Notification/>
            <div className={cx('userPage')}>
                <div className={cx('layoutContent')}>
                    <ProfileHeader 
                        viewOwnProfile={viewOwnProfile} 
                        viewUserData = {userProfile}
                        loggedInUserData = {loggedInUserData}
                    />

                    <div className={cx('body')}>
                        <div className={cx('navigationTab')}>
                            <Button text className={cx('videosTab', `${navigation === 'videos' && 'active'}`)} onClick={ () =>setNavigation('videos')}>Videos</Button>
                            
                            {viewOwnProfile && 
                                (<Button text className={cx('favoriteTab', `${navigation === 'favorite' && 'active'}`)}  onClick={() => setNavigation('favorite')}>
                                    {privateFavoriteVideo === true &&  <BsLockFill className = {cx('lockIcon')}/>}
                                    Favorite    
                                </Button>)
                            }

                            <Button text className={cx('likedTab', `${navigation === 'liked' && 'active'}`)}  onClick={() => setNavigation('liked')}>
                                {privateLikedVideo === true && viewOwnProfile === false &&  <BsLockFill className = {cx('lockIcon')}/>}
                                Liked    
                            </Button>
                            <div className={cx('bottomLine')}></div>
                        </div>


                        <div className={cx('userContent')}>
                            {navigation === 'videos' ?  (videoList.length > 0 ?
                                (<div className={cx('videoListContainer')}>
                                    {videoList.map((video, index) => {
                                        return(
                                            <div className={cx('videoPlayerWrapper')} key = {index}>                                           
                                                <div className={cx('videoPlayerContainer')} key = {index} onClick={() => handleOpenVideoModal(video, index)}>
                                                    <div className={cx('paddingTop')}>
                                                        <div className={cx('linkContainer')}>
                                                            <div className={cx('videoLink')}
                                                                onMouseOver={() => playVideo(index)}
                                                                onMouseLeave={() => pauseVideo(index)}>
                                                                <div className={cx('divContainer')}>
                                                                    <div className={cx('thumbnailContainer')}>
                                                                        <img
                                                                            src={video.thumb_url}
                                                                            alt={video.description}
                                                                            className={cx('image')}
                                                                        />
                                                                        <div className={cx('divWrapper')}>
                                                                            <div className={cx('videoPlayer')}>
                                                                                <video
                                                                                    className={cx('video')}
                                                                                    src={video.file_url}
                                                                                    muted={true}
                                                                                    preload="auto"
                                                                                    playsInline={true}
                                                                                    crossOrigin="anonymous"
                                                                                    ref={(ref) => (videoRef.current[index] = ref)}
                                                                                    loop={true}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cx('videoPostDesc')}>
                                                    {video.description}
                                                </div>
                                            </div>
                                        )                               
                                    })}
                                </div>
                                )
                                :
                                (
                                <div className={cx('noVideoContainer')}>
                                    {(viewOwnProfile === true) ? 
                                    (   
                                        <div className={cx('content')}>
                                            <IoPersonOutline className={cx('noVideoIcon')}/>
                                            <p className={cx('noVideoTitle')}>Upload your first video</p>
                                            <p className={cx('noVideoDescription')}>Your videos will appear here</p>
                                        </div>
                                    ):
                                    (
                                        <div className={cx('content')}>
                                            <IoPersonOutline className={cx('noVideoIcon')}/>
                                            <p className={cx('noVideoTitle')}>No content</p>
                                            <p className={cx('noVideoDescription')}>This user has not published any videos.</p>
                                        </div>
                                    )}
                                </div>)):

                                (<></>)
                            }

                            {navigation === 'liked' ? (likedVideoList.length > 0 ? 
                                    (<div className={cx('videoListContainer')}>

                                    </div>)
                                    :
                                    (
                                    <div className={cx('noVideoContainer')}>
                                    
                                    {(viewOwnProfile === true) ? 
                                    (   
                                        <div className={cx('content')}>
                                            <IoPersonOutline className={cx('noVideoIcon')}/>
                                            <p className={cx('noVideoTitle')}>No liked videos yet</p>
                                            <p className={cx('noVideoDescription')}>Videos you liked will appear here</p>
                                        </div>
                                    ):
                                    (
                                        <div className={cx('content')}>
                                            <FiLock className={cx('noVideoIcon')}/>
                                            <p className={cx('noVideoTitle')}>This user's videos are private</p>
                                            <p className={cx('noVideoDescription')}>Videos liked by this user are currently hidden</p>
                                        </div>
                                    )}
                        
                                </div>)) 
                                :(<></>)
                            }

                            {navigation === 'favorite' ? (likedVideoList.length > 0 ? 
                                     (<div className={cx('videoListContainer')}>
                                        
                                    </div>):(
                                    <div className={cx('noVideoContainer')}>
                                        <div className={cx('content')}>
                                            <BsBookmark className={cx('noVideoIcon')}/>
                                            <p className={cx('noVideoTitle')}>Favorite posts</p>
                                            <p className={cx('noVideoDescription')}>Your favorite posts will appear here.</p>
                                        </div>
                                    </div>

                                    )) 
                                :(<></>)
                            }
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
