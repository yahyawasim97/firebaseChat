import React from 'react';
import {Comment,Image} from 'semantic-ui-react';
import moment from 'moment';

const isOwnMessage=(message,user)=>{
    return message.user.id === user.uid? 'message__self':''
}
const isImage=message=>{
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}
const timefromNow = timeStamp => moment(timeStamp).fromNow();
const Message =({message,user})=>(
    <Comment>
        <Comment.Avatar src={message.user.avatar}/>
        <Comment.Content className={isOwnMessage(message,user)}>
            <Comment.Author as="a">{message.user.name}</Comment.Author>
            <Comment.Metadata>{timefromNow(message.timeStamp)}</Comment.Metadata>
            
            {isImage(message)?<Image src={message.image} className="message__Image"/> 
            :
            <Comment.Text>{message.content}</Comment.Text>
            }
        </Comment.Content>
    </Comment>
);
export default Message;