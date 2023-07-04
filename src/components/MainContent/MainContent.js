import classNames from 'classnames/bind';
import styles from './MainContent.module.scss';

const cx = classNames.bind(styles);

function MainContent() {
    return ( <h2 className= {cx('header')}>Main Content</h2> );
}

export default MainContent;