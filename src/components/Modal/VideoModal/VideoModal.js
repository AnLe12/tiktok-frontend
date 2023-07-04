import classNames from 'classnames/bind';
import styles from './VideoModal.module.scss';

import { useEffect, useRef, useState } from 'react';

import * as loggedInUser from './../../../utils/loggedInUser';
import * as userService from './../../../services/userService'
import * as commentService from './../../../services/commentService'
import * as likeService from './../../../services/likeService'


import Image from './../../Image'
import Button from './../../Button'
import Comment from '../../Comment';

import {AiFillCheckCircle, AiFillHeart} from 'react-icons/ai'
import {HiOutlineMusicalNote} from 'react-icons/hi2'
import {FaCommentDots} from 'react-icons/fa'
import {ImEmbed} from 'react-icons/im'
import {BsFacebook,BsWhatsapp,BsTwitter,BsFillSendFill } from 'react-icons/bs';
import  {GrEmoji} from 'react-icons/gr';
import VideoScreen from './VideoScreen/VideoScreen';
// import { PlayIcon } from '../../Icons';
const cx = classNames.bind(styles);

function VideoModal(props) {
    console.log(props)
    const { hideVideoModal, video, videoId, indexOfVideo, handleNextVideo, handlePrevVideo } = props
    // const videoId = useParams().videoId
    const accessToken = loggedInUser.getToken();
    // const [videoData, setVideoData] = useState()
    const [followed, setFollowed] = useState(video?.user.is_followed)
    const [showMore, setShowMore] = useState(false);
    const [showLess, setShowLess] = useState(true);
    // const [description, setDescription] = useState()
    const [commentList, setCommentList] = useState()
    const [commentInput, setCommentInput] = useState()
    const [isLikedVideo, setIsLikedVideo] = useState(video?.is_liked)
    const [likesCount, setLikesCount] = useState(video?.likes_count)

 
    const textAreaRef = useRef();

    useEffect(() => {
        console.log('videoModal: ', window.location);
        // console.log(window.location);
        window.history.replaceState(null, '', `/users/${video.user.nickname}/video/${videoId}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    const resizeTextArea = () => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
      };
    
    useEffect(resizeTextArea, [commentInput]);

    useEffect(() => {
        const fetchAPI = async () => {
            // const response = await videoService.getAVideo(videoId, accessToken)
            // console.log(response);
            // if (response) {
            //     setVideoData(response)
            //     setDescription(response.data.description)
            // }
            const commentData = await commentService.getPostedComments(videoId,accessToken)
            if (commentData) {
                setCommentList(commentData)
            }
        }
        fetchAPI()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[videoId])

    

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
                    if (res.data) {
                        setFollowed(res.data.is_followed);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            userService
                .followAnUser(video?.user.id, accessToken)
                .then((res) => {
                    if (res.data) {
                        setFollowed(res.data.is_followed);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const showMoreDesc = () => {
        setShowMore(true)
        setShowLess(false)
    }

    const showLessDesc = () => {
        setShowMore(false)
        setShowLess(true)
    }

    

    const handleLikeAPost= (e) => {
        e.preventDefault();
        if ( !accessToken) {
            alert('Please login!');
            return;
        }
        if(isLikedVideo){
            likeService.unlikeAPost(videoId, accessToken)
                .then((result) =>{
                    setIsLikedVideo(result.data.is_liked)
                    setLikesCount(result.data.likes_count)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else{
            likeService.likeAPost(videoId, accessToken)
                .then((result) =>{
                    setIsLikedVideo(result.data.is_liked)
                    setLikesCount(result.data.likes_count)
                    
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    
    
    const handleCommentInputChange = (e) => {
        const commentValue = e.target.value;
        if(!commentValue.startsWith(' ')){
            setCommentInput(commentValue)
        }
    }

    const handlePostComment = async (e) => {
        e.preventDefault()
        commentService.createAComment(videoId,commentInput, accessToken)
            .then((result) => {
                console.log(result)
                
            })
    }
    
   

    // console.log('commentList: ',commentList)


    return (
        <div className = {cx('wrapper')}>
            {/* VideoScreen */}
            
            <VideoScreen hideVideoModal={hideVideoModal} handlePrevVideo={handlePrevVideo} handleNextVideo={handleNextVideo} videoData={video} indexOfVideo={indexOfVideo}/>
            <div className = {cx('contentWrapper')}>
                <div className={cx('header')}>
                    <div className = {cx('videoInfo')}>
                        <Button className={cx('userItemBtn')} to={`/users/${video?.user.nickname}`}>
                            <div className={cx('userItem')}>
                                <div className={cx('userAva')}>
                                    <Image className={cx('userImg')} small src={video?.user.avatar} alt="Default Avatar"/>
                                </div>
                                <div className={cx('userInfo')}>
                                    <div className={cx('userTitleContainer')}>
                                        <div className={cx('userTitle')}>
                                            {video?.user.nickname}
                                        </div>
                                        <div>
                                            {video?.user.tick?<AiFillCheckCircle className={cx('userStar')} />: null}
                                        </div>
                                    </div>
                                    <div className={cx('userDesc')}>{video?.user.first_name} {video?.user.last_name} </div>

                                </div>
                            </div>
                        </Button> 

                        <div className = {cx('followBtnContainer')} onClick = {handleFollowUser}>
                            <Button className = {cx('followBtn' ,`${followed && 'followedBtn'}`)} outline>
                                {followed ? 'Following' : 'Follow'}
                            </Button>
                        </div> 
                    </div>
                    <div className={cx('mainContent')}>
                        <div className={cx('description')}>
                            {(showLess && !showMore) &&<p>{video.description.substring(0, 250)}</p>}
                            {(!showLess && showMore) && <p>{video.description}</p>}
                            {(video.description?.length > 250 && showLess) &&                                
                                <Button text className={cx('moreBtn')} onClick={showMoreDesc}>more</Button>}
                            {(video.description?.length > 250 && showMore) &&                                
                                <Button text className={cx('moreBtn')} onClick={showLessDesc}>less</Button>}

                            <p className={cx('music')}>
                                <HiOutlineMusicalNote className={cx('musicIcon')}/>
                                {video?.music}
                            </p>
                        </div>

                        <div className={cx('interactiveInfo')}>
                            <div className={cx('videoCountInfo')}>
                                <button className = {cx('countItem')}>
                                    <div className = {cx('btnWrapper', `${isLikedVideo && 'active'}`)} onClick = {handleLikeAPost}>
                                        <AiFillHeart className = {cx('icon')}/>
                                   </div>
                                   {likesCount}
                                    
                                </button>

                                <button className = {cx('countItem')}>
                                    <div className = {cx('btnWrapper')}>
                                        <FaCommentDots className = {cx('icon')}/>
                                    </div>
                                   {video?.comments_count}
                                </button>
                            
                            </div>
                            <div className={cx('shareBtn')}>
                                <button className = {cx('countItem')}>
                                    <div className = {cx('btnWrapper')}>
                                        <ImEmbed className = {cx('icon')}/>
                                   </div>                                    
                                </button>

                                <button className = {cx('countItem')}>
                                    <div className = {cx('btnWrapper')}>
                                        <BsFillSendFill className = {cx('icon')}/>
                                   </div>                                    
                                </button>

                                <button className = {cx('countItem')}>
                                    <div className = {cx('btnWrapper')}>
                                        <BsFacebook className = {cx('icon')}/>
                                   </div>                                    
                                </button>

                                <button className = {cx('countItem')}>
                                    <div className = {cx('btnWrapper')}>
                                        <BsWhatsapp className = {cx('icon')}/>
                                   </div>                                    
                                </button>

                                <button className = {cx('countItem')}>
                                    <div className = {cx('btnWrapper')}>
                                        <BsTwitter className = {cx('icon')}/>
                                   </div>                                    
                                </button>
                            </div>
                        </div>

                        <div className = {cx('copyLinkContainer')}>
                            <p className = {cx('link')}>localhost:3000/video/{video?.id}</p>
                            <button className = {cx('copyLinkBtn')}>Copy link</button>
                        </div>
                      
                    </div>
                </div>
                
                <div className = {cx('commentListContainer')}>

                    {!commentList ? (<p className = {cx("emptyComment")}>Be the first to comment!</p>) 
                    :
                        (commentList.map((comment, index) => {
                        return(
                            <Comment key = {index} data = {comment}></Comment>
                        )
                        }))
                    }
                    
                </div>

                <div className = {cx('bottomContainer')}>
                    <div className = {cx('commentCreateContainer')}>
                        <div className = {cx('commentCreate')}>
                            <div className = {cx('commentInputContainer')}>
                                <textarea 
                                    ref={textAreaRef}
                                    rows={1}
                                    className={cx('commentInput')} 
                                    placeholder="Add comment..."
                                    value = {commentInput}
                                    onChange={handleCommentInputChange}
                                    maxLength = "150"
                                ></textarea>
                                {(commentInput && textAreaRef.current.scrollHeight > 30) && <p className={cx("charCount")}>{commentInput?.length}/150</p>}
                                <button type='button' className ={cx('emojiBtn')} ><GrEmoji /></button>
                            </div>
                            <Button type='button' disabled = {!commentInput} text className={cx('postBtn')} onClick={handlePostComment}>Post</Button>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
    }

export default VideoModal;