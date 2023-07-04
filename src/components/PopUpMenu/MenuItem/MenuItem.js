import classNames from 'classnames/bind';
import styles from './MenuItem.module.scss';

import PropTypes from 'prop-types';

// import UserItem from '../../UserList/UserItem'
import Button from './../../Button';

const cx = classNames.bind(styles);

function MenuItem({data, onClick}){
    const classes = cx('itemList', {
        separate: data.separate,
        formatFont: data.formatFont
        
      });
    
    return (
        <Button className={classes} leftIcon={ data.icon} to={data.to} onClick={onClick}>
            <div className={cx('title')}>{data.title}</div> 
        </Button>
    )
 

}

MenuItem.prototypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,

}

export default MenuItem;