import React,{Component} from 'react';
import {Segment,Comment} from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import firebase from '../../firebase';
import Message from './Message';

class Messages extends Component{
    state={
        messagesRef:firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages:[],
        messagesLoading:true
    };
    componentDidMount(){
        const {channel,user} = this.state;
        if(channel && user){
            this.addListeners(channel.id);
        }
    }

    addListeners=channelId=>{
        this.addMessageListener(channelId);

    }

    addMessageListener=channelId=>{
        let loadedMessages=[];
        this.state.messagesRef.child(channelId).on('child_added',snap=>{
            loadedMessages.push(snap.val());
            this.setState({
                messages:loadedMessages,
                messagesLoading:false
            })
        })
    }

    displayMessages= messages=>(
        messages.length>0 && messages.map(message=>(
            <Message
                key={message.timeStamp}
                message={message}
                user={this.state.user}
            />
        ))
    )
    displayChannelName=channel=>channel?`#${channel.name}`:'';
    render(){
        const {messagesRef,channel,user,messages} = this.state;
        return(
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                />

                <Segment>
                    <Comment.Group className="messages">
                    {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessagesForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                />
            </React.Fragment>
        )
    }
}
export default Messages;