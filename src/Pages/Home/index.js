import classNames from "classnames/bind";
import styles from './Home.module.scss';
import { Virtuoso } from 'react-virtuoso';
import Video from './../../components/Video';
import Notification from "../../components/Notification";

import { useCallback, useEffect, useRef, useState } from "react";
import * as userService from './../../services/userService'

import * as loggerInUser from './../../utils/loggedInUser'
import { useContext } from "react";

import { VideoModalContextShow } from '../../contexts/VideoModalContext';


const cx = classNames.bind(styles);

function Home() {
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
  const [noMoreVideo, setNoMoreVideo] = useState(false);


//   console.log(videoArrayRef.current)

  const {videoModalVisible, toggleVideoModalVisible, propsOfVideoModal, setPropsOfVideoModal} = useContext(VideoModalContextShow)

  const loadMoreVideos = useCallback(() => {
    if (page < 1) return;
    return setTimeout(async () => {
        setPage(handleRandomPage(1, 10));
        const response = await userService.getVideoList('for-you', page,accessToken);
        if (Array.isArray(response.data)) {
            response.data.sort(() => Math.random() - 0.5);
            setVideoList([...videoList, ...response.data]);
        }
        if (response.data.length === 0 || page === response.meta.pagination.total) {
            setNoMoreVideo(true);
        }
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, accessToken]);

  useEffect(() => {
      const timeForLoading = loadMoreVideos();
      return () => clearTimeout(timeForLoading);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() =>{
  //   userService
  //     .getVideoList('for-you', page,accessToken)
  //     .then((res) =>{
  //       if(Array.isArray(res)){
  //         setVideoList(res)
  //       }
  //       if (res.length === 0){
  //         setNoMoreVideo(true);
  //       }
  //     })
  //     .catch((e)=> console.log(e));
  // },[page, accessToken])

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

    // console.log(currentVideoId);
    if (currentVideoId >= videoList.length - 1) {
        return;
    } else {
        const nextVideoId = currentVideoId + 1;
        const nextVideo = videoArrayRef.current[nextVideoId];
        // console.log("nextVideo: ",nextVideo)
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


  return (
    <div className={cx('mainContent')}>
      <Notification/>
      <Virtuoso
                data={videoList}
                useWindowScroll
                endReached={() => {
                    if (!noMoreVideo) {
                        loadMoreVideos();
                    }
                }}
                itemContent={(index, video) => (
                    <Video
                        videoArray={videoArrayRef.current}
                        key={index}
                        video={video}
                        index={index}
                        handleOpenVideoModal={handleOpenVideoModal}
                    />
                )}
                components={{
                    Footer: () => {
                        return (
                            <div className={cx('footer')}>
                                {noMoreVideo && <p className={cx('no-more-video')}>No more video to load</p>}
                            </div>
                        );
                    },
                }}
            />
      {/* {videoList.map((video, index) => 
        (
          <Video videoArray={videoArrayRef.current} key={index} data={video} index={index} handleShowVideoModal={handleShowVideoModal}/>
        )
      )}

      {noMoreVideo && <p className={cx('noMoreVideo')}>No more video to load</p>} */}

    </div>
  );
}

export default Home;

