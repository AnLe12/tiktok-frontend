import * as httpRequest from './../utils/httpRequest';

export const getPostedComments = async (videoId, accessToken) =>{
    try{
        const res = await httpRequest.get(`videos/${videoId}/comments?page=1`,{
            headers: {"Authorization" : `Bearer ${accessToken}`},

        })
        return res.data;
    }
    catch(e){
        console.log(e);
    }
}

export const createAComment = async ( videoId, comment, accessToken) =>{
    try{
        const res = await httpRequest.post(`videos/${videoId}/comments`,{comment},{
            headers: {"Authorization" : `Bearer ${accessToken}`},
        })
        return res.data;
    }
    catch(e){
        console.log(e)
    }
}

export const likeAPostedComment = async (commentId, accessToken) =>{
    try{
        const res = await httpRequest.post(`/comments/${commentId}/like`,{},{
            headers: {"Authorization" : `Bearer ${accessToken}`},
        })
        return res
    }
    catch(e){
        console.log(e);
    }
}

export const unlikeAPostedComment = async (commentId, accessToken) =>{
    try{
        const res = await httpRequest.post(`/comments/${commentId}/unlike`,{},{
            headers: {"Authorization" : `Bearer ${accessToken}`},
        })
        return res
    }
    catch(e){
        console.log(e);
    }
}