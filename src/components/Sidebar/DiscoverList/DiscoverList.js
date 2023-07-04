import DiscoverItem from './DiscoverItem';
import classNames from "classnames/bind";
import styles from './DiscoverList.module.scss';

const cx = classNames.bind(styles);
function DiscoverList({items = []}){
    const renderDiscoverList = () => {
        return items.map((item,index)=>{
            return(
                <DiscoverItem
                    key = {index}
                    data = {item}
                />
            )
        })
    }
    return (
        <div className={cx('discoverList')}>
            {renderDiscoverList()}
        </div>
    )
}



export default DiscoverList;
