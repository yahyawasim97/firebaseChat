import * as actionTypes from './types';

export const setUser=user=>{
    return{
        type:actionTypes.SET_USER,
        payload:{
            currentUser:user
        }
    }
}
export const clearUser =() =>{
    return{
        type:actionTypes.CLEAR_USER
    }

}
export const setChannel =(channel) =>{
    return{
        type:actionTypes.SET_CHANNEL,
        payload:{
            currentChannel:channel
        }
    }
}