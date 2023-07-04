import classNames from "classnames/bind";
import styles from './UserItem.module.scss';
import PropTypes from 'prop-types'

import Button from "../../Button";
import {AiFillCheckCircle} from 'react-icons/ai';

import Image from '../../Image';
const cx = classNames.bind(styles);

function UserItem({data, className, visibility = true}) {
    return ( 
        <div className = {cx('userItemContainer')}>  
            <Button className={cx('userItemBtn')} to={`/users/${data?.nickname}`}>
                <div className={cx('userItem')}>
                    <div className={cx('userAva')}>
                        <Image className={cx('userImg')} small src={data?.avatar} alt="Default Avatar"/>
                    </div>
                    <div className={cx('userInfo')}>
                        <div className={cx('userTitleContainer')}>
                            <div className={cx('userTitle')}>
                                {data?.nickname}
                            </div>
                            <div>
                                {data?.tick?<AiFillCheckCircle className={cx('userStar')} />: null}
                            </div>
                        </div>
                        <div className={cx('userDesc')}>{data?.first_name} {data?.last_name}</div>

                    </div>
                </div>
            </Button> 
            {visibility &&
                <div className = {cx('userProfile')}>
                    <div className={cx('headerContainer')}>
                        <Button to={`/users/${data?.nickname}`}>
                            <div className={cx('userAva')}>
                                <Image className={cx('userImg')} small src={data?.avatar} alt="Default Avatar"/>
                            </div>
                        </Button >
                        {data.is_followed?
                            <Button className = {cx('followedBtn')}>
                                Following
                            </Button>
                            
                            :
                            <Button primary >
                                Follow
                            </Button>
                        }
                    </div>
                    <Button text to={`/users/${data?.nickname}`} className={cx('userInfo')}>
                        <div  className={cx('userTitleContainer')}>
                            <div className={cx('userTitle')}>
                                {data?.first_name} {data?.last_name} 
                            </div>
                            <div>
                                {data?.tick?<AiFillCheckCircle className={cx('userStar')} />: null}
                            </div>
                        </div>
                        <div className={cx('userDesc')}>{data?.nickname}</div>
                    </Button>

                    <p className={cx('userCount')}>
                        <span className={cx('userStatsText')}>{data?.followers_count}</span>
                        <span className={cx('userStatsDesc')}>Followers</span>
                        <span className={cx('userStatsText', 'strong')}>{data?.likes_count}</span>
                        <span className={cx('userStatsDesc')}>Likes</span>
                    </p>

                </div>
            }
            

        </div>
    );
}

UserItem.prototypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    visibility: PropTypes.bool,
}

export default UserItem;