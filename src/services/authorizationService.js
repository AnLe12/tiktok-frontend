// Sign up for new users
import * as httpRequest from '../utils/httpRequest'

export const signUp = async (type, email, password) => {
    try{
        const res = await httpRequest.post('auth/register',{
                type,
                email,
                password
            },     
            
        )
        return res;
    }

    catch(e){
        console.log(e)
    }
}