import {combineReducers} from 'redux';
import * as actionTypes from '../actions/types';

const Initial_User_State={
    currentUser:null,
    isLoading:true,
}

const user_reducer = (state=Initial_User_State,action)=>{
    switch(action.type){
        case actionTypes.SET_USER:
            return{
                ...state,
                currentUser:action.payload.currentUser,
                isLoading:false
            }
        case actionTypes.CLEAR_USER:
            return{
                ...Initial_User_State,
                isLoading:false
            }
    
        default:
            return state;
    }
}

const Initial_Channel_State={
    currentChannel:null,
    isPrivateChannel:false,
    userPosts: null
}

const channel_reducer = (state=Initial_Channel_State,action)=>{
    switch(action.type){
        case actionTypes.SET_CHANNEL:
            return{
                ...state,
                currentChannel: action.payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return{
                ...state,
                isPrivateChannel:action.payload.isPrivateChannel
            }
        case actionTypes.SET_USER_POSTS:
            return{
                ...state,
                userPosts:action.payload.userPosts
            }
        default:
            return state;
    }
}

const Initial_Colors_State={
    primaryColor:'#000001',
    secondaryColor:'lightblue',

}

const colors_reducer = (state=Initial_Colors_State,action)=>{
    switch(action.type){
        case actionTypes.SET_COLORS:
            return{
                ...state,
                primaryColor: action.payload.primaryColor,
                secondaryColor: action.payload.secondaryColor 
            }
        default:
            return state;
    }
}
const rootReducer = combineReducers({
    user:user_reducer,
    channel:channel_reducer,
    colors: colors_reducer
})
export default rootReducer;