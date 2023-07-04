import classNames from 'classnames/bind';
import styles from './PopUpMenu.module.scss';
import {AiOutlineLeft} from 'react-icons/ai';

import PropTypes from 'prop-types';
const cx = classNames.bind(styles);

function HeaderMenu({title, onBack, className}) {
    const classes = cx('headerMenuContainer',{
        [className] : className
        }
    );
    if (className ==='nonBackBtn'){
        return ( 
            <header className={classes}>
                <h4 className={cx('headerTitle')}>{title}</h4>
            </header>  
        )
    }
    else{
        return ( 
            <header className={classes}>
                <button className={cx('backBtn')} onClick={onBack}>
                    <AiOutlineLeft/>
                </button>
                <h4 className={cx('headerTitle')}>{title}</h4>
            </header>   
        );
    }
}

export default HeaderMenu;

HeaderMenu.prototypes = {
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
}