import classNames from 'classnames/bind';
import styles from './PopUpMenu.module.scss'

import {useState} from 'react';
import MenuItem from './MenuItem';
import HeaderMenu from './HeaderMenu';


const cx = classNames.bind(styles);
const defaultFunction = () =>{};

function PopUpMenu({className, items =[], onChange = defaultFunction} ) {
    const classes = cx('wrapper', {[className]: className});;
    const [history, setHistory] = useState([{data: items}])

    // Current now contains MenuItem - get the last param of items
    const current = history[history.length - 1];
    
    const renderMenuItem = () => {
        return current.data.map((item, index) => {
                const isParent = !!item.children           
                return(
                    <MenuItem
                        key = {index}
                        data = {item}
                        onClick={() =>{
                            if(isParent) {
                                setHistory((prev) =>[...prev, item.children]);
                            }
                            else {
                                onChange(item)
                            }
                        }}
                    />
                )
            
        })
    }
        

    const handleBack = () =>{
        setHistory((prev) => prev.slice(0,prev.length - 1));
    };

    const handleReset = () => {
        setHistory((prev) => prev.slice(0, 1))
    }
    
    return (
        <div className={classes} 
        onMouseLeave={handleReset}
        >
            {history.length >1 && <HeaderMenu title={current.title} onBack={handleBack}/>}
            <div className= {cx('menuBody')}>{renderMenuItem()}</div>
        </div>
    )
  
    
    
 }

export default PopUpMenu;