import classNames from 'classnames/bind';
import styles from './HeaderOnlyLayout.module.scss';

import PropTypes from 'prop-types';

import Header from './../../components/Header'

const cx = classNames.bind(styles)

function HeaderOnlyLayout({children}){
    return(
        <div className = {cx('wrapper')}>
            <Header/>
            <div className = {cx('content')}>
                {children}
            </div>
        </div>
    )
}

HeaderOnlyLayout.prototypes = {
    content: PropTypes.node.isRequired,
}

export default HeaderOnlyLayout;