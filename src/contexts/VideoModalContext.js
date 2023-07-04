import { createContext, useState } from "react";
import VideoModal from "../components/Modal/VideoModal/VideoModal";

export const VideoModalContextShow = createContext()

function VideoModalContext({children}) {
    const [videoModalVisible, setVideoModalVisible] = useState(false)
    const [propsOfVideoModal, setPropsOfVideoModal] = useState({})
    const [urlStart, setUrlStart] = useState('');
    const hideVideoModal = () => {
        setVideoModalVisible(false)
        window.history.replaceState(null, '', urlStart);
    }

    const toggleVideoModalVisible= () => {
        setVideoModalVisible(true);
        console.log(window.location)
        const { pathname, hash, search } = window.location;
        const urlOrigin = pathname + hash + search;
        setUrlStart(urlOrigin);
    }
    const value = {videoModalVisible, toggleVideoModalVisible, propsOfVideoModal, setPropsOfVideoModal}
    return (
        <VideoModalContextShow.Provider value={value}>
            {children}
            {videoModalVisible && <VideoModal hideVideoModal={hideVideoModal} {...propsOfVideoModal}/>}
        </VideoModalContextShow.Provider>
    );
}

export default VideoModalContext;