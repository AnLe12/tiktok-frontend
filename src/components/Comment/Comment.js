import classNames from 'classnames/bind';
import styles from './Comment.module.scss';

import {AiOutlineHeart,AiFillHeart} from 'react-icons/ai';

import Image from './../Image'

import * as commentService from './../../services/commentService'
import * as loggedInUser from './../../utils/loggedInUser';
import { useState } from 'react';


const cx = classNames.bind(styles)
function Comment({data}) {
    const accessToken = loggedInUser.getToken()
    const [liked, setLiked] = useState(data?.is_liked)
    const [likedCount, setLikedCount] = useState(data?.likes_count)
    const likeCommentAction = (e) => {
        e.preventDefault();
        if ( !accessToken) {
            alert('Please login!');
            return;
        }
        if(liked){
            commentService.unlikeAPostedComment(data.id, accessToken)
                .then((result) =>{
                    console.log('unlike',result)
                    setLiked(result.data.is_liked)
                    setLikedCount(result.data.likes_count)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else{
            commentService.likeAPostedComment(data.id, accessToken)
                .then((result) =>{
                    setLiked(result.data.is_liked)
                    setLikedCount(result.data.likes_count)
                    
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }



    return(
        <div className={cx('wrapper')}>
            <div className = {cx('avaContainer')}>
                <Image 
                    src={data?.user.avatar} 
                    alt={'n'} 
                    className={cx('avatar')}
                />
            </div>
            <div className = {cx('mainContainer')}>
                <strong className={cx('fullName')}>{data?.user?.first_name} {data?.user?.last_name}</strong>
                <p className={cx('commentContent')}>{data?.comment}</p>
                <div className={cx('otherContainer')}>
                    <span className={cx('postedTime')}>{`${data?.updated_at}`.substring(0,10)}
                    </span>
                    <button  className={cx('replyBtn')}>Reply</button>
                </div>
            </div>
            <div className = {cx('likeBtnContainer')}>
                {liked ? <AiFillHeart className = {cx('likeBtn',  'liked' )} onClick = { likeCommentAction}/> 
                :
                    <AiOutlineHeart className = {cx('likeBtn' )} onClick = { likeCommentAction}/>}

                <p className = {cx('countLike')}>{likedCount}</p>
            </div>

        </div>
    )
}

export default Comment;