import { useEffect, useState } from "react";
import classNames from "classnames/bind"
import styles from './VideoScreen.module.scss'
import { useRef } from "react";
import { BsChevronDown, BsChevronUp, BsFillPlayFill, BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs";
import Button from "../../../Button/Button";
import { AiOutlineClose } from "react-icons/ai";

const cx = classNames.bind(styles)

function VideoScreen({hideVideoModal, handlePrevVideo, handleNextVideo, videoData, indexOfVideo}) {
    
    const [playing, setPlaying] = useState(true);
    const [voiceProgress, setVoiceProgress] = useState(70);
    const [muted, setMuted] = useState(false);
    const [timeProgress, setTimeProgress] = useState(0);
    console.log(playing)
    const videoRef = useRef();
    const secondsToMS = (seconds) => {
        seconds = Number(seconds);
        var m = Math.floor(seconds % 3600/ 60);
        var s = Math.floor(seconds % 3600 % 60);
    
        var mDisplay = m >= 10 ? m: (m < 0 ? ('0') + m + (':' ) : "00:");
        var sDisplay = s >= 10 ? s  :(s > 0 ? ('0') + s : '00');
        return mDisplay + sDisplay; 
    }
    const handleTimeProgress = () => {
        setTimeProgress(videoRef.current.currentTime / videoRef.current.duration * 100);
    }

    const handleTimeProgressBarChange = (e) => {
        const seekTime = videoData?.meta.playtime_seconds / 100 * e.target.value
        videoRef.current.currentTime = seekTime;
        setTimeProgress(seekTime/videoData?.meta.playtime_seconds * 100 )
    }

    const onOffVOice = () =>{
        if(voiceProgress === 0 || muted){
            setVoiceProgress(voiceProgress)
            setMuted(false)
            videoRef.current.muted = false;
            videoRef.current.volume = voiceProgress/100
        }
        else{
            setMuted(true)
            videoRef.current.muted = true;
        }
    }
    
    const handleVoiceProgressBarChange = (e) => {
        const volumeInput = e.target.value
        setVoiceProgress(volumeInput)
        videoRef.current.volume = voiceProgress/100
    }

    useEffect(() => {
        playing ? videoRef.current.play() : videoRef.current.pause();
    }, [playing])

    const onVideoClick = () => {
        setPlaying(!playing);
    };
    return (
        <div className = {cx('videoWrapper')} onClick={onVideoClick}>
            <div className={cx('outsideVideBackground')} style={{'backgroundImage': `url(${videoData?.thumb_url})`}}></div>
            <div className = {cx('playerWrapper')}>
                <img className={cx('hidden')} src={videoData?.thumb_url} alt={videoData?.user.nickname}/>
                <video  
                    onTimeUpdate={handleTimeProgress}
                    className={cx('video')}
                    loop
                    playsInline = {true}
                    autoPlay = {true}
                    ref = {videoRef }
                    src={videoData?.file_url}
                >
                </video>

                <div className={cx("videoControlContainer")}>
                    <div className={cx("progressBarContainer")}> 
                        <div className={cx("progressBarLayer")} style = {{'width': `${timeProgress}%`}}></div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                className={cx('timeProgressBar')}
                                value = {timeProgress}
                                onChange={(e) =>handleTimeProgressBarChange(e)}
                            ></input>
                        </div>
                        <span className={cx('timer')}>{videoData  && secondsToMS(timeProgress *videoData.meta.playtime_seconds / 100)}
                        : {videoData?.meta.playtime_string}</span>
                    </div>
                </div>

            
            
            <div className={cx("voiceControlContainer")}>
                {/* mở hoặc tắt tiếng here */}
                <button className={cx('voiceBtn')}  onClick={onOffVOice}>
                    {voiceProgress === '0'|| muted  ? <BsFillVolumeMuteFill  className={cx('voiceIcon')}/>: <BsFillVolumeUpFill className={cx('voiceIcon')}/>}
                </button>
                <div className={cx("voiceBarContainer")}>
                    <div className={cx("voiceBarLayer")} style = {{'width': `${voiceProgress}%`}}></div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        className={cx('voiceProgressBar')}
                        value = {voiceProgress}
                        onChange={(e) =>handleVoiceProgressBarChange(e)}
                    ></input>
                </div>
                
            </div>
            {/* Button close, button up, button down */}
            {indexOfVideo > 0 && (
                <Button className={cx('prevBtn')} onClick={(e) => handlePrevVideo(indexOfVideo, e)}>
                    <span>
                        <BsChevronUp className={cx('prevIcon')}/>
                    </span>
                </Button>

            )}
            <Button className={cx('nextBtn')} onClick={(e) => handleNextVideo(indexOfVideo, e)}>
                <span>
                    <BsChevronDown className={cx('nextIcon')}/>
                </span>
            </Button>
            <Button className = {cx('btnWrapper')} onClick= { hideVideoModal}  >
                <AiOutlineClose className = {cx('closeBtn')}/>
            </Button>
            {!playing && (
                <Button className={cx('playBtn')}>
                    <BsFillPlayFill className={cx('playIcon')} />
                </Button>
            )}
        </div>
    );
}

export default VideoScreen;