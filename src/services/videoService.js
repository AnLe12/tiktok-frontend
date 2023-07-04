import * as httpRequest from './../utils/httpRequest';

export const getAVideo = async(videoId, accessToken = '') => {
    try{
        const res= await httpRequest.get(`videos/${videoId}`,{ 
            headers: {"Authorization" : `Bearer ${accessToken}`},

        });
        return res
    }
    catch (err) {
        console.log(err);
    }
}

export const createNewVideo = async (dataUpload, accessToken) => {
    try {
        const res = await httpRequest.post('videos', dataUpload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};