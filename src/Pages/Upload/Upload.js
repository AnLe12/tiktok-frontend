import classNames from 'classnames/bind';
import styles from './Upload.module.scss'

import {useState, useRef, useContext,  } from 'react';

import {FaCloudUploadAlt} from 'react-icons/fa';
import {BsScissors,BsCheck, BsPlayCircle, BsPauseCircle, BsFillVolumeMuteFill,BsFillVolumeUpFill} from 'react-icons/bs';
import { TfiSplitH } from "react-icons/tfi";
import {AiOutlineCheckCircle,AiFillCaretDown} from 'react-icons/ai'

import Button from './../../components/Button'
import Image from '../../components/Image';
import images from './../../assets/images'
import PopUpMenu from '../../components/PopUpMenu';
import {NotificationContextShow} from '../../contexts/NotificationContext';


import * as loggedInUser from './../../utils/loggedInUser'
import * as handleCreateVideo from './../../utils/handleCreateVideo'
import * as videoService from './../../services/videoService'

const cx = classNames.bind(styles)

const PRIVACY_CHOICES = [
    {   
      title: 'Public',
      code: 'public',
      formatFont: 'normal',
    },
    {   
      title: 'Friends',
      code: 'friends',
      formatFont: 'normal',

    },
    {   
      title: 'Private',
      code: 'private',
      formatFont: 'normal',
    },
]
function Upload() {
    const accessToken = loggedInUser.getToken()
    const currentUser = loggedInUser.loggedInUser()
    const [,setNotification] = useContext(NotificationContextShow)

    const [fileVideo, setFileVideo] = useState()
    const [videoSource, setVideoSource] = useState()
    const [changeState, setChangeState] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [timeProgress, setTimeProgress] = useState(0);
    const [muteVideo,setMuteVideo] = useState(false)
    const [thumbnailList,setThumbnailList] = useState([])
    const [fileInfo, setFileInfo] = useState({
        fileName: null,
        duration: 0,
        time: 0,
        size: 0,
    });

    const [sliderValue, setSliderValue] = useState(0);
    const [privacyValue, setPrivacyValue] = useState('Public')
    const [showPrivacyMenu, setShowPrivacyMenu] = useState(false)
    const [captionValue, setCaptionValue] = useState(fileInfo.fileName)
    const [allowInteraction, setAllowInteraction] = useState(['comment', 'duet', 'stitch'])
    // eslint-disable-next-line no-unused-vars
    const [musicValue, setMusicValue] = useState(
        `Original sound - ${currentUser?.first_name} ${currentUser?.last_name}`);

    const videoRef = useRef()
    const coverSliderRef = useRef()    


    // Convert from seconds to MM : SS
    const secondsToMS = (seconds) => {
        const sec = parseInt(seconds, 10);
        var m = Math.floor(sec % 3600/ 60);
        var s = Math.floor(sec % 3600 % 60);

        var mDisplay = m >= 10 ? m: (m < 0 ? ('0') + m + (':' ) : "00:");
        var sDisplay = s >= 10 ? s  :(s > 0 ? ('0') + s : '00');
        return mDisplay + sDisplay; 
    }

    const handleUploadVideo = () => {
        document.getElementById('uploadVideo').click();
    };

    const getSelectedVideo= (e) => {
        const fileInput = e.target.files[0]
        if(fileInput && fileInput.type.match('video')){
            const URL = window.URL || window.webkitURL;
            // create a video viewer.
            setVideoSource(URL.createObjectURL(fileInput))
            setFileVideo(fileInput)
            handleCreateVideo.getVideoDuration(fileInput).then((duration) => {
                setFileInfo({
                    fileName: fileInput.name,
                    duration: secondsToMS(duration),
                    time: duration,
                    size: fileInput.size
                })
                setCaptionValue(fileInput.name)
                
            }
            )

            handleCreateVideo.generateVideoThumbnails(fileInput, 8).then((thumbnails) => {
                setThumbnailList(thumbnails.slice(0, 8))
            })
            setChangeState(true)
        }
        else{
            return;
        }
        
    }

    
    const handleTimeProgress =(e) =>{
        setTimeProgress(e.target.currentTime / e.target.duration * 100);
    }    

    const handleTimeProgressBarChange = (e) =>{
        e.stopPropagation()
        const seekTime = e.target.value;
        setTimeProgress(seekTime * fileInfo.time / 100)
        videoRef.current.currentTime = seekTime * fileInfo.time / 100
    }

    const handlePrivacyMenuChange = (e) =>{
        const value = e.title
        setPrivacyValue(value)
    }

    const onVideoClick = () => {
        if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(!isPlaying);
        } else {
        videoRef.current.play();

        setIsPlaying(!isPlaying);
        }
    };
    
    const handleVolume = (e) => {
        e.stopPropagation();
        setMuteVideo(!muteVideo) 
        videoRef.current.volume = muteVideo;
    }


    const coverSliderChange = (e) => {
        setSliderValue(e.target.value);
        coverSliderRef.current.currentTime = e.target.value /100 * fileInfo.time;
    }

    const handleCaptionInput = (e) => {
        setCaptionValue(e.target.innerHTML)
        
    }

    const handleCheckedBox = (e) => {
        const title = e.target.value
        setAllowInteraction((prev) => {
            const isChecked = allowInteraction.includes(title);
            if (isChecked) {
                return allowInteraction.filter((item) => item !== title);
            } 
            else {
                return [...prev, title];
            }
        });
    };

    const postVideo = async (e) => {
        const dataUpload = new FormData();

        // upload file
        dataUpload.append('upload_file', fileVideo);
        // description
        dataUpload.append('description', captionValue);
        // music
        musicValue && dataUpload.append('music', musicValue);
        // cover
        dataUpload.append('thumbnail_time', timeProgress);
        // viewable
        dataUpload.append('viewable', privacyValue.toLowerCase());
        // Allow user
        allowInteraction.forEach((item) => {
            item && dataUpload.append('allows[]', item.toLowerCase());
        });
        videoService.createNewVideo(dataUpload, accessToken)
            .then(() =>{
                setNotification('Upload video successfully')
                window.location =`/users/${currentUser.nickname}`; 
            })
            .catch(() =>{ 
                setNotification('Error in the uploading process. Please try again!')
            }) 
    }



    return ( 
        <div className= {cx('wrapper')}>
            {changeState?
                <section className= {cx('uploadWrapper')}>
                    <div className= {cx('editSelectedVideo')}>
                        <div className= {cx('editCard')}>
                            <div className= {cx('videoInfoContainer')}>
                                <div className= {cx('videoIndex')}>
                                    <span className= {cx('number')}>1</span>
                                </div>
                                <div className= {cx('videoCover')}>
                                    {/* Image here */}
                                    
                                </div>
                                <div className= {cx('videoBasic')}>
                                    <p className={cx('videoName')}>Video Name</p>
                                    <p className={cx('videoTime')}>
                                        <span className={cx('timeStart')}>00:00</span>
                                        <span >-</span>
                                        <span className={cx('timeEnd')}>{fileInfo.duration}</span>

                                        <span className={cx('timeDuration')}>{parseInt(fileInfo.time, 10)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className= {cx('editBtnContainer')}>
                                <Button primary leftIcon={<BsScissors className= {cx('editIcon')}/>} className= {cx('editVideoBtn')}>Edit video</Button>
                            </div>
                        </div>

                        <div className= {cx('splitCard')}>
                            <div className= {cx('splitContainer')}>
                                <p className={cx('instruction')}>Split into multiple parts to get more exposure.</p>
                                <p className={cx('splitCount')}>
                                    <span className={cx('splitControl')}>-</span>
                                    <span className={cx('splitNumber')}>2</span>
                                    <span className={cx('splitControl')}>+</span>
                                    
                                </p>
                            </div>

                            <div className= {cx('splitBtnContainer')}>
                                <Button className= {cx('splitBtn')} disabled leftIcon={<TfiSplitH className= {cx('splitIcon')}/>}>Split</Button>
                            </div>
                        </div>
                    </div>

                    <div className= {cx('reviewSelectedVideo')}>
                        <h2 className= {cx('reviewTitle')}>Upload video</h2>
                        <p className={cx('reviewDescription')}>Post a video to your account</p>

                        <div className= {cx('contentUpload')}>

                            <div className= {cx('previewContainer')} >
                                <div className= {cx('mobilePreview')} onClick={onVideoClick}>
                                    <div className= {cx('mobileVideoContainer')} >
                                        <video 
                                            className ={cx('mobileVideo')} 
                                            src={videoSource}
                                            ref = {videoRef}
                                            onTimeUpdate={(e) => {handleTimeProgress(e)}}
                                        ></video>
                                    </div>

                                    <div className= {cx('mobileLayout')}>
                                        <div className= {cx('mobileHeader')}>
                                            <img src = {images.liveSVG} alt='liveIcon' />
                                            <div className= {cx('navBar')}>
                                                <span className= {cx('navItem')}>Following</span>
                                                <span className= {cx('navItem')}>For you</span>
                                            </div>
                                            <img src= {images.searchSVG} alt = 'searchIcon'/>
                                        </div>
                                        <div className= {cx('mobileInteractiveBar')}>
                                            <Image small src={currentUser?.avatar} alt ='avatar'/>
                                            <img src={images.interactiveBar} alt ='interactiveBar'/>
                                            <div className={cx('albumContainer')}>
                                                <img className={cx('albumAvatar')} src={currentUser?.avatar} alt='running disk'/>
                                            </div>

                                        </div>
                                        <div className= {cx('videoDescription')}>
                                            <p className={cx('username')}>@ {currentUser?.nickname}</p>
                                            <p className={cx('description')}>{captionValue ? (captionValue.length > 15? captionValue.substring(0,15) + '...' : captionValue):''}</p>
                                            <div className={cx('videoSound')}>
                                                <img src={images.music} className={cx('musicNote')} alt='music'/>
                                                <span className={cx('soundName')}>{musicValue}</span>
                                            </div>
                                        </div>
                                        <div className= {cx('mobileFooter')}></div>
                                    </div>

                                    <div className={cx('videoControlContainer')}>
                                        <div className={cx('displaySection')}>
                                            <div className={cx('videoButtons')}>
                                                <button className={cx('playBtn')} onClick={onVideoClick}>
                                                    {!isPlaying ? <BsPlayCircle className={cx('playIcon')} /> : <BsPauseCircle className={cx('playIcon')}/>}
                                                </button>
                                                <span className={cx('timer')}>{fileVideo ? secondsToMS(timeProgress * fileInfo.time / 100) : '00:00'} /
                                                    {fileInfo.duration}
                                                </span>
                                                <button className={cx('volumeBtn')} onClick={handleVolume}> 
                                                    {muteVideo ? <BsFillVolumeMuteFill className={cx('volumeIcon')}/> : <BsFillVolumeUpFill className={cx('volumeIcon')}/>}
                                                </button>
                                            </div>  
                                        
                                            <div className={cx('videoProgressBarContainer')}>
                                                <div className={cx("progressBarContainer")}>
                                                    <div className={cx("progressBarLayer")} style = {{'width': `${timeProgress}%`}}
                                                    ></div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            step="1"
                                                            className={cx('timeProgressBar')}
                                                            value = {timeProgress}
                                                            onChange={(e) =>{handleTimeProgressBarChange(e)}}
                                                        ></input>
                                                </div>
                                            </div> 
                                        </div> 
                                    </div>  

            
                                </div>
                                <div className= {cx('changVideoContainer')}>
                                    <p className= {cx('videoDescription')}>
                                        <AiOutlineCheckCircle className={cx('checkedIcon')}/>
                                        {fileVideo.name}
                                    </p>
                                    {/* <Button className= {cx('changVideoBtn')} text>Change video</Button> */}

                                </div>

                            </div>

                            <div className= {cx('contentContainer')}>
                                <div className= {cx('formGroup')}>
                                    <div className= {cx('labelContainer')}>
                                        <p className = {cx('label')}>Caption</p>
                                        <p className = {cx('textRequirement')}>
                                            <span className= {cx('letterCount')}>{captionValue? captionValue.length : 0}</span>
                                            <span className= {cx('letterRequirement')}>/2200</span>
                                        </p>
                                    </div>
                                    <div 
                                        className={cx('captionInput')} 
                                        onBlur={(e) => handleCaptionInput(e)} 
                                        suppressContentEditableWarning={true} 
                                        contentEditable={true}
                                    >
                                        {captionValue}
                                    </div>
                                </div>


                                <div className= {cx('formGroup')}>
                                    <p className = {cx('label')}>Cover</p>
                                    <div className={cx('coverSelectionsContainer')} >
                                        <div className={cx('coverList')}>
                                            {thumbnailList ?
                                                ( thumbnailList.map((src, id) => (
                                                    <img draggable="false" className={cx('videoCover')} key={id} src={src} alt="videoCover" />)))
                                            :
                                            <p className={cx('videoCover', 'emptyCover')} ></p>
                                            }
                                        </div>
                                        <div className={cx('coverSliderContainer')}>
                                            <div className={cx('coverSliderTrack')}  style ={{'--slide-data': sliderValue + '%', }}>
                                                <div className={cx('coverSliderChosen')} >
                                                    <div className={cx('videoCoverSlider')} >
                                                        <video 
                                                            className ={cx('videoSlider')} 
                                                            src={videoSource}
                                                            ref = {coverSliderRef}
                                                    ></video>
                                                    </div>
                                                </div>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100" 
                                                step="1" 
                                                value={sliderValue}
                                                className={cx('slider')}
                                                onChange={(e) => {
                                                    coverSliderChange(e);
                                                }}
                                            ></input>
                                        </div>
                                    </div>
                                </div>

                                <div className= {cx('formGroup')}>
                                    <p className = {cx('label')}>Who can watch this video</p>
                                    
                                    <div className={cx('selectorContainer')} onClick = {() =>{
                                        setShowPrivacyMenu(!showPrivacyMenu)
                                    }}>
                                        <div className={cx('selectorLabel')}>
                                            <p className={cx('privacySelected')}>{privacyValue}</p>
                                            <AiFillCaretDown/>
                                        </div> 
                                        <div className={cx('popUpList', `${showPrivacyMenu ? '':'hiddenPopUpList'}`)}  >
                                            <PopUpMenu className={cx('privacyOptions')} userSelectedItem = {privacyValue} items = {PRIVACY_CHOICES} type= 'menu' onChange={(e) =>handlePrivacyMenuChange(e)}/>
                                        </div>
                                    </div>
                                </div>

                                <div className= {cx('formGroup')}>
                                    <p className = {cx('label')}>Allow users to:</p>
                                    <div className= {cx('selectorContainer')}>
                                        <label className = {cx('labelCheckInput')}>
                                            <input 
                                                type="checkbox" 
                                                className = {cx('checkInput')} 
                                                value='comment'
                                                onChange = {(e) =>{handleCheckedBox(e)}}
                                                checked = {allowInteraction.includes('comment')}
                                            />
                                            <span className = {cx('checkmark')}><BsCheck className = {cx('checkmarkIcon')}/></span>
                                            Comment
                                        </label>

                                        <label className = {cx('labelCheckInput')}>
                                            <input 
                                                type="checkbox" 
                                                className = {cx('checkInput')} 
                                                value='duet' 
                                                onChange = {(e) =>{handleCheckedBox(e)}}
                                                checked = {allowInteraction.includes('duet')}
                                            />
                                            <span className = {cx('checkmark')}><BsCheck className = {cx('checkmarkIcon')}/></span>
                                            Duet
                                        </label>

                                        <label className = {cx('labelCheckInput')}>
                                            <input 
                                                type="checkbox" 
                                                className = {cx('checkInput')} 
                                                value='stitch' 
                                                onChange = {(e) =>{handleCheckedBox(e)}}
                                                checked = {allowInteraction.includes('stitch' )}
                                            />
                                            <span className = {cx('checkmark')}><BsCheck className = {cx('checkmarkIcon')}/></span>
                                            Stitch
                                        </label>
                                    </div>
                                </div>

                                <div className = {cx('formGroup')}>
                                    <div className = {cx('sameRow')}>
                                        <p className = {cx('label')}>Run a copyright check</p>
                                        <div className = {cx('switchBtnContainer')}>
                                            <input type="checkbox" id='switchCheckBox' className = {cx('switchInput')} hidden/>
                                            <label  className = {cx('switchBtn')} htmlFor='switchCheckBox'>
                                            </label>
                                        </div>
                                    </div>
                                        <p className = {cx('copyright')}>We'll check your video for potential copyright infringements on used sounds. If infringements are found, you can edit the video before posting. <strong>Learn more</strong></p>
                                </div>

                                <div className = {cx('buttonsContainer')}>
                                    <Button href='/' className = {cx('discardBtn')} large outline >Discard</Button>
                                    <Button className = {cx('postBtn')} large primary onClick={postVideo}>Post</Button>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            :
            (<section className= {cx('uploadContainer')}>
                <div className= {cx('layoutContainer')}>
                    <div className= {cx('innerContainer')}>
                        <input
                            id="uploadVideo"
                            type="file"
                            accept="video/*"
                            className={cx('fileInput')}
                            hidden = {true}
                            onChange={getSelectedVideo}
                        >
                        </input>
                        <div className= {cx('contentContainer')} onClick = {handleUploadVideo}>      
                            <span className= {cx('uploadIconContainer')}><FaCloudUploadAlt className= {cx('uploadIcon')}/></span>
                            <h3 className= {cx('title')} >Select video to upload</h3>
                            <p className= {cx('description')} >Or drag and drop a file</p>
                            <p className= {cx('description', 'space')}>Long videos can be split into multiple parts to get more exposure</p>
                            <p className= {cx('detailDescription')} >MP4 or WebM</p>
                            <p className= {cx('detailDescription')} >720x1280 resolution or higher</p>
                            <p className= {cx('detailDescription')} >Up to 30 minutes</p>
                            <p className= {cx('detailDescription')} >Less than 2 GB</p>
                            <Button type ='file' primary className={cx('selectBtn')}>Select file</Button>
                        </div>
                        
                    </div>
                </div>
            </section>)
            }
        </div>
     );
}

export default Upload;