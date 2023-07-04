import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';

// For icon:
import {AiOutlineSearch} from 'react-icons/ai';
import {IoMdCloseCircle} from 'react-icons/io';
import {TbLoaderQuarter} from 'react-icons/tb';

import UserItem from '../UserList/UserItem';

import { useDebounce } from '../../hooks';

import * as searchService from './../../services/searchService'
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

function SearchBar() {
    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounced = useDebounce(searchValue,500)

    const inputRef = useRef()

    const searchResultRef = useRef();
    useEffect(() => {
        if(!debounced.trim()){
            setSearchResult([])
            return;
        }
        
        const fetchAPI = async () =>{
            setLoading(true)
            const result = await searchService.search(debounced);
            setSearchResult(result)
            setLoading(false)

        };

        fetchAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced])


    // On Click outside search result.
    useEffect (() => {
        document.addEventListener('mousedown', (event) =>{
            if(!(searchResultRef?.current?.contains(event.target))){
                handleHideResult()
            }
        });
    })


    const handleSearchValueChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const handleClear = () =>{
        setSearchValue(''); 
        setSearchResult([])
        inputRef.current.focus()
    }

    const handleHideResult = () => {
        setShowResult(false);
        
    };

    return ( 
        <div  className= {cx('searchBar')}>
            <input 
                value={searchValue}
                ref = {inputRef}
                type='search' 
                placeholder='Search accounts and videos'
                spellCheck = {false}
                onChange = {handleSearchValueChange}
                onFocus={() => { 
                    setShowResult(true)
                }
                }            
                />

            {!!searchValue && (
                <button 
                    className ={cx('clear')} 
                    onClick = {handleClear}
                >
                    <IoMdCloseCircle/>
                </button>
            )}
            {loading && <button className ={cx('loading')} >
                <TbLoaderQuarter/>
            </button> }
            <button className={cx('searchBtn')} onMouseDown = {(e) => e.preventDefault()}>
                <AiOutlineSearch className={cx('searchIcon')}/>
            </button>
            
            
            <div ref = {searchResultRef} className={cx('searchResultPopperContainer') }
             style={{visibility: (showResult &&  searchResult?.length > 0) ? 'visible' : 'hidden' }}
            >
                <div className={cx('searchResultPopper')}>
                    <h4 className={cx('searchTitle')}>Accounts</h4>                    
                    {
                       searchResult?.map((item,index) =>{
                        return(
                            <UserItem
                                data = {item}
                                key = {index}
                                visibility = {false}
                            />
                        )
                    })
                    }
                </div>
            </div>
        </div>
     );
}

export default SearchBar;