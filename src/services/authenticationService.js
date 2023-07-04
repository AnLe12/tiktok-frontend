import * as httpRequest from '../utils/httpRequest';
// import * as loggedInUser from './../utils/loggedInUser' 

export const logIn = async (email, password) => {
    try {
        const res = await httpRequest.post('auth/login', {
                email,
                password
            
        })
        return res;
    }
    catch (err) {
        console.log(err);
    }
}

export const getCurrentUser = async (accessToken) => {
    try {
        const res = await httpRequest.get('auth/me', { 
            headers: {"Authorization" : `Bearer ${accessToken}`} 
        })

        return res;
    }
    catch (err) {
        console.log(err);
    }
}

export const updateCurrentUser = async (data,accessToken) => {
    try {
        const res = await httpRequest.post('auth/me?_method=PATCH', 
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`
                  
                },
              }
            
        
        )
        return res
    }
    catch (err) {
        console.log(err);
    }
}
