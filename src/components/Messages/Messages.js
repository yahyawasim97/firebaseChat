import React,{Component} from 'react';
import {Segment,Comment} from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import firebase from '../../firebase';
import Message from './Message';

class Messages extends Component{
    state={
        privateChannel:this.props.isPrivateChannel,
        messagesRef:firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages:[],
        messagesLoading:true,
        numUniqueUsers:'',
        searchTerm:'',
        searchLoading:false,
        searchResults:[],
        privateMessagesRef:firebase.database().ref('privateMessages'),
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
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added',snap=>{
            loadedMessages.push(snap.val());
            this.setState({
                messages:loadedMessages,
                messagesLoading:false
            });
            this.countUniqueUsers(loadedMessages);
        });
        
    }

    countUniqueUsers=messages=>{
        const uniqueUsers= messages.reduce((acc,message)=>{
            if(!acc.includes( message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        },[]);
        const plural =uniqueUsers.length>1 ||uniqueUsers.length===0
        const numUniqueUsers= `${uniqueUsers.length} user${plural?'s':''}`;
        this.setState({numUniqueUsers})
    }
    handleSearchChange= event =>{
        this.setState({
            searchTerm:event.target.value,
            searchLoading:true
        },()=>this.handleSearchMessage())
    }
    handleSearchMessage=()=>{
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm,'gi');
        const searchResults = channelMessages.reduce((acc,message)=>{
            if((message.content && message.content.match(regex)) || message.user.name.match(regex)){
                acc.push(message)
            }
            return acc;
        },[])
        this.setState({searchResults})
        setTimeout(()=>this.setState({searchLoading:false}),500);
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
    displayChannelName=channel=>{
        return channel? `${this.state.privateChannel? '@': '#'}${channel.name}`:''
    }
    getMessagesRef=()=>{
        const {messagesRef,privateMessagesRef,privateChannel} = this.state;
        return privateChannel? privateMessagesRef:messagesRef
    }
    render(){
        const {messagesRef,channel,user,messages,numUniqueUsers,searchTerm,searchResults,searchLoading,privateChannel} = this.state;
        return(
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange= {this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                />

                <Segment>
                    <Comment.Group className="messages">
                    {searchTerm?this.displayMessages(searchResults):this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessagesForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        )
    }
}
export default Messages;