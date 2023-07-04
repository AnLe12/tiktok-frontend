/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import styles from './Video.module.scss';
import {HiOutlineMusicalNote} from 'react-icons/hi2'
import {AiFillHeart} from 'react-icons/ai';
import {FaCommentDots,FaShare} from 'react-icons/fa';

import Image from '../Image';
import Button from './../Button';
// import { ModalContext } from '../../contexts/ModalContext';


// For Video Modal:

import PropTypes from 'prop-types'
import { useEffect, useRef, useState,
    // useContext 
} from "react";
import useElementOnScreen from '../../hooks/useElementOnScreen'

import * as likeService from './../../services/likeService'
import * as userService from './../../services/userService'
import * as loggerInUser from './../../utils/loggedInUser'

const cx = classNames.bind(styles);

function Video({ videoArray, video, isFollowing, index, handleOpenVideoModal}) {
    const accessToken = loggerInUser.getToken();
    const [playing, setPlaying] = useState(false);
    const [likesCount, setLikesCount] = useState(video?.likes_count);
    const [isLikedVideo, setIsLikedVideo] = useState(video?.is_liked);
    const [followed, setFollowed] = useState(video?.user.is_followed);

    const {
        meta: {
            video: { resolution_x: videoWidth, resolution_y: videoHeight },
        },
    } = video;

    const verticalVideo = videoHeight / videoWidth > 1;

    // console.log(videoArray)

    const videoRef = useRef(null);

    //  const modalContext = useContext(ModalContext)
    // const toggleModalVisible =() => {
    //     modalContext.toggleModalVisible()
    // }
    const wrapperRef = useRef();
    useEffect(() => {
        const optionsScroll = {
            block: 'start',
            behavior: 'smooth',
        };
        videoArray[index] = {
            index: index,
            video: video,
            scrollVideo: wrapperRef.current.scrollIntoView.bind(wrapperRef.current, optionsScroll),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // For scrolling to the video, it plays auto
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    }
    const isVisible = useElementOnScreen(options, videoRef)
    const onVideoClick = () => {
        if (playing) {
        videoRef.current.pause();
        setPlaying(!playing);
        } else {
        videoRef.current.play();
        setPlaying(!playing);
        }
    };

    useEffect(() => {
        if (isVisible) {
            if (!playing) {        
                videoRef.current.play();
                setPlaying(true)
            }
            }
            else {
            if (playing) {        
                videoRef.current.pause();
                setPlaying(false)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible])

    
    const toggleLikeVideo = (e) => {
        e.preventDefault();
        if ( !accessToken) {
            alert('Please login!');
            return;
        }
        if(isLikedVideo){
            likeService.unlikeAPost(video?.id, accessToken)
                .then((result) =>{
                    setIsLikedVideo(result.data?.is_liked)
                    setLikesCount(result.data?.likes_count)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else{
            likeService.likeAPost(video?.id, accessToken)
                .then((result) =>{
                    setIsLikedVideo(result.data?.is_liked)
                    setLikesCount(result.data?.likes_count)
                    
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const handleFollowUser = (e) => {
        e.preventDefault();
        if ( !accessToken) {
            alert('Please login!');
            return;
        }
        if (followed) {
            userService
                .unFollowAnUser(video?.user.id, accessToken)
                .then((res) => {
                    console.log(res);
                    if (res.data) {
                        setFollowed(res.data?.is_followed);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            userService
                .followAnUser(video?.user.id, accessToken)
                .then((res) => {
                    console.log(res);
                    if (res.data) {
                        setFollowed(res.data?.is_followed);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    // console.log('videoArray:' ,videoArray)
    return(
        <div className = {cx('videoContainer')} ref={wrapperRef}>
            <Button className = {cx('videoAuthorAvaContainer')} to={`/users/${video?.user.nickname}`}>
                <Image className = {cx('videoAuthorAva')} medium src={video?.user.avatar} alt={video?.user.nickname} />
            </Button>
            <div  className = {cx('videoContentContainer')}>
                <div className = {cx('videoAuthorInfoContainer')}>
                    <div className = {cx('videoAuthorInfo')}>
                        <div className = {cx('videoAuthorName')} >
                            <h3 className ={cx('authorTitleContainer')} >
                                <Button text className ={cx('authorTitle')} to={`/users/${video?.user.nickname}`}>
                                    {video?.user.nickname}

                                    <h4 className ={cx('authorSubtitle')}>
                                        {video?.user.first_name} {video?.user.last_name} 
                                    </h4>                        
                                </Button>
                            </h3> 
                            
                        </div>

                        <div className = {cx('videoDesc')}>
                            {video?.description}
                        </div> 

                        { video?.music &&
                            <div className = {cx('videoMusic')}>
                                <h4>
                                    <HiOutlineMusicalNote className = {cx('videoMusicIcon')} />
                                    <Button className = {cx('videoMusicBtn')} text>{video?.music}</Button>
                                </h4>
                            </div> 
                        }
                    </div>
                    <div className = {cx('followBtnContainer')} onClick = {handleFollowUser}>
                        <Button className = {cx('followBtn' ,`${followed && 'followedBtn'}`)} outline>
                            {followed ? 'Following' : 'Follow'}
                        </Button>
                    </div> 
                </div>

                <div className = {cx('videoPlayerContainer')}>
                    
                    <div className={cx('videoPlayer', `${verticalVideo ? 'vertical' : 'horizontal'}`)} onClick={() => handleOpenVideoModal(video, index)}>
                        <div className = {cx('videoLink')}>
                            <video  
                                className={cx('video')}
                                controls
                                loop={false}
                                muted={true}
                                playsInline
                                ref = {videoRef }
                                onClick={onVideoClick}  
                                
                            >
                                <source src={video?.file_url} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>                      
                    </div>
                    

                    <div className={cx('action')}>
                            <Button className={cx('actionContainer')} onClick = {toggleLikeVideo}>
                                <span className={cx('actionBtn')}>
                                    <AiFillHeart className={cx('actionIcon',`${isLikedVideo === true && 'active'}`)}/>
                                </span>
                                <strong className="">{likesCount}</strong>
                            </Button>
                            <Button className={cx('actionContainer')}>
                                <span className={cx('actionBtn')}>
                                    <FaCommentDots className={cx('actionIcon')}/>
                                </span>
                                <strong className="">{video?.comments_count}</strong>
                            </Button>
                            <Button className={cx('actionContainer')}>
                                <span className={cx('actionBtn')}>
                                    <FaShare className={cx('actionIcon')} />
                                </span>
                                <strong className="text-xs text-black/70">{video?.shares_count}</strong>
                            </Button>
                        </div>
                </div>
            </div>

           
            

            
        </div>
    )
}


Video.prototypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
}
export default Video;