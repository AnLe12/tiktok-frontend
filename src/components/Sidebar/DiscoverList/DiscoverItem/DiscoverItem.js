import classNames from 'classnames/bind';
import styles from './DiscoverItem.module.scss';
import Button from './../../../Button';
import {HiHashtag, HiOutlineMusicalNote} from 'react-icons/hi2';

const cx = classNames.bind(styles);

function DiscoverItem({data}){
    const TagIcon = <HiHashtag className= {cx('iconType')}/>;
    const MusicIcon = <HiOutlineMusicalNote className= {cx('iconType')}/>
    return (
        <div className={cx('discoverItemContainer')}>
            <Button rounded className={cx('discoverItem')} >
                {data.type === 'music' ? MusicIcon : TagIcon}
                {data.discover}
            </Button>
        </div>
        
    )
}

export default DiscoverItem;

