// import {useState} from 'react'

const tokenString =  JSON.parse(localStorage.getItem('user'))
export const loggedInUser = () =>{
    return tokenString?.data
} 


export const getToken =() =>{
    const userToken = tokenString?.meta?.token
    return userToken
}

export const saveUser =  (data) => {
    localStorage.setItem('user', JSON.stringify(data))
}

export const removeToken = () => {
    localStorage.removeItem('user')
}


