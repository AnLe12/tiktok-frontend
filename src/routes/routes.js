import {HeaderOnlyLayout, ProfileLayout} from './../layouts';

import config from '../config';

import Home from '../Pages/Home';
import Following from '../Pages/Following';
import Profile from '../Pages/Profile';
import Search from '../Pages/Search';
import Upload from '../Pages/Upload';
import VideoModal from '../components/Modal/VideoModal';


const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.following, component: Following },
    { path: config.routes.profile, component: Profile, layout: ProfileLayout},
    { path: config.routes.upload, component: Upload, layout: HeaderOnlyLayout },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.videoModal, component: VideoModal, layout: null },
  ];

const privateRoutes = [];

export {publicRoutes, privateRoutes};