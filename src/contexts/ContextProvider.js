import NotificationProVider from './NotificationContext';
import ModalProvider from './ModalContext';
import LoginModalProvider from './LoginModalContext';
import VideoProvider from './VideoModalContext';

function ContextProvider({ children }) {
    return (
        <NotificationProVider>
            <VideoProvider>
                <LoginModalProvider>
                    <ModalProvider>{children}</ModalProvider>
                </LoginModalProvider>
            </VideoProvider>
        </NotificationProVider>
    );
}

export default ContextProvider;