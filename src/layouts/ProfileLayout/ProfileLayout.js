import classNames from 'classnames/bind';
import styles from './ProfileLayout.module.scss';

import PropTypes from 'prop-types';

import Header from './../../components/Header';
import Sidebar from './../../components/Sidebar';

const cx = classNames.bind(styles);

function ProfileLayout({children}) {
    return ( 
        <div className = {cx('wrapper')}>
            <Header className={cx('header')}/>

            <div className = {cx('container')}>
                <Sidebar className={cx('sidebar')}/>
                <div className = {cx('content')}>{children}</div>
            </div>

        </div>
     );
}

ProfileLayout.prototypes = {
    children: PropTypes.node.isRequired,
}

export default ProfileLayout;
