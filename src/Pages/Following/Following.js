import classNames from "classnames/bind";
import styles from './Following.module.scss';

import { useState, useEffect, useRef, useContext } from 'react';
import * as loggerInUser from './../../utils/loggedInUser'
import * as userService from './../../services/userService'

import Video from './../../components/Video'
import { VideoModalContextShow } from "../../contexts/VideoModalContext";

const cx = classNames.bind(styles);
function Following(){
    const videoArrayRef = useRef([]);
  
  const pageRandom = useRef([]);

    const handleRandomPage = (min, max) => {
        const countPage = max + 1 - min;
        const randomList = pageRandom.current;
        let page;

        if (randomList.length >= countPage) {
            randomList.length === countPage && randomList.push(max);
            page = ++randomList[randomList.length - 1];

            return page;
        }

        do {
            page = Math.floor(Math.random() * countPage + min);
        } while (randomList.includes(page));

        randomList.push(page);

        return page;
    };

  const accessToken = loggerInUser.getToken()
  const [videoList, setVideoList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(handleRandomPage(1, 10))

  const {videoModalVisible, toggleVideoModalVisible, propsOfVideoModal, setPropsOfVideoModal} = useContext(VideoModalContextShow)
    // console.log(videoList)

    useEffect(() =>{
        const fetchApi = async () => {
            setPage(handleRandomPage(1, 10));
            const response = await userService.getVideoList('following', page,accessToken);
            if (Array.isArray(response.data)) {
                response.data.sort(() => Math.random() - 0.5);
                setVideoList([...videoList, ...response.data]);
            }

        }
        fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken])

    const handleOpenVideoModal = (video, index) => {
        videoArrayRef.current[index].scrollVideo();
        const newProps = {
            video: video,
            videoId: video.id,
            indexOfVideo: index
        }
        setPropsOfVideoModal({...newProps})
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
    
      const handleNextVideo = (index, e) => {
        e.stopPropagation()
        const currentVideoId = videoArrayRef.current.findIndex((inViewObj) => inViewObj.index === index);
    
        if (currentVideoId >= videoList.length - 1) {
            return;
        } else {
            const nextVideoId = currentVideoId + 1;
            const nextVideo = videoArrayRef.current[nextVideoId];
            nextVideo.scrollVideo();
            const newProps = {
                video: nextVideo.video,
                videoId: nextVideo.video.id,
                indexOfVideo: nextVideoId,
            };
            setPropsOfVideoModal({ ...propsOfVideoModal, ...newProps });
        }
      };
    
      const handlePrevVideo = (index, e) => {
        e.stopPropagation()
        const currentVideoId = videoArrayRef.current.findIndex((inViewObj) => inViewObj.index === index);
    
        if (currentVideoId <= 0) {
            return;
        } else {
            const prevVideoId = currentVideoId - 1;
            const prevVideo = videoArrayRef.current[prevVideoId];
            prevVideo.scrollVideo();
            const newProps = {
                video: prevVideo.video,
                videoId: prevVideo.video.id,
                indexOfVideo: prevVideoId,
            };
            setPropsOfVideoModal({ ...propsOfVideoModal, ...newProps });
        }
      };

    return(
        <div className={cx('wrapper')}>
            {videoList && videoList.length > 0 ? 
                <div className={cx('followingPage')}>
                    {videoList.map((video, index) => (
                        <Video videoArray={videoArrayRef.current} key={index} video={video} index={index} handleOpenVideoModal={handleOpenVideoModal}/>
                    ))}
                </div>
            : 
                <div className={cx('followingPage', 'noVideo')}>No video from your followers</div>
            
            }
        </div>
    )
}
export default Following;
