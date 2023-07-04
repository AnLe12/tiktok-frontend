import * as httpRequest from '../utils/httpRequest';

export const getSuggestAccount = async(page) => {
    try{
        const res = await httpRequest.get('users/suggested',{
            params: {
                page,
            }
        })

        return res;
    }

    catch (e){
        console.log(e)
    }
}

export const getFollowUsers = async (page, accessToken) => {
    try{
        const res = await httpRequest.get('me/followings',{
            params:{ page,},
            headers: {Authorization: `Bearer ${accessToken}`,}
        })
        return res
    }
    catch (error) {
        console.log(error);
    }
}

export const getVideoList = async (type, page, accessToken ='') =>{
    try{
        const res = await httpRequest.get('videos', {
            params:{
                type,
                page
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return res
    }
    catch(e){
        console.log(e)
    }
}

export const getAnUser = async (nickname, accessToken = '') => {
    try{
        const res = await httpRequest.get(`users/@${nickname}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        )
        return res.data
    }
    catch(e){
        console.log(e)
    }
}

export const followAnUser = async ( userId, accessToken ) => {
    try {
        return await httpRequest.post(`users/${userId}/follow`, [], {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                withCredentials: true,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

export const unFollowAnUser = async (userId, accessToken) => {
    try {
        return await httpRequest.post(`users/${userId}/unfollow`, [], {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                withCredentials: true,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

