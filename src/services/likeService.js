import * as httpRequest from './../utils/httpRequest'

export const  likeAPost = async (videoId,  accessToken) =>{
    try{
        const res = await httpRequest.post(`videos/${videoId}/like`,
        {},
        { 
            headers: {"Authorization" : `Bearer ${accessToken}`},

        })
        return res;
    }

    catch (err) {
        console.log(err);
    }
}
export const  unlikeAPost = async (videoId, accessToken) =>{
    try{
        const res = await httpRequest.post(`videos/${videoId}/unlike`,
        {},
        { 
            headers: {"Authorization" : `Bearer ${accessToken}`},
        })
        return res;
    }

    catch (err) {
        console.log(err);
    }
}


