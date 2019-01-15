import React,{Component} from 'react';
import {Segment,Button,Input} from 'semantic-ui-react';
import firebase from '../../firebase';
import FileModal from './FileModal';
import uuidv4 from 'uuid/v4';
import ProgressBar from './ProgressBar';

class MessagesForm extends Component{
    state={
        message:'',
        loading:false,
        channel:this.props.currentChannel,
        user: this.props.currentUser,
        errors:[],
        modal:false,
        uploadState:'',
        uploadTask:null,
        storageRef:firebase.storage().ref(),
        percentUpload:0
    }


    openModal=()=> this.setState({modal:true})
    closeModal=()=> this.setState({modal:false})
    handleChange=event=>{
        this.setState({[event.target.name]:event.target.value})
    }

    createMessage=(fileUrl=null)=>{
        const message ={
            timeStamp:firebase.database.ServerValue.TIMESTAMP,
            user:{
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar:this.state.user.photoURL
            }
        };
        if(fileUrl!==null){
            message['image'] =fileUrl;
        }
        else{
            message['content'] =this.state.message;
        }
        return message;
    }

    sendMessage=()=>{
        const {messagesRef}=this.props;
        const {message,channel} =this.state;
        if(message){
            this.setState({loading:true})
            messagesRef.child(channel.id)
            .push()
            .set(this.createMessage())
            .then(()=>{
                this.setState({loading:false,message:'',errors:[]})
            })
            .catch(err=>{
                console.log(err);
                this.setState({
                    loading:false,
                    errors:this.state.errors.concat(err)
                })
            })
        }else{
            this.setState({
                errors:this.state.errors.concat({message:'Add a message'})
            })
        }
    }

  
    uploadFile=(file,metadata)=>{
        const pathToUpload =this.state.channel.id;
        const ref= this.props.messagesRef;
        const filePath =`chat/public/${uuidv4()}.jpg`
        this.setState({
            uploadState:'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file,metadata)
        },
        ()=> {
            this.state.uploadTask.on('state_changed',snap=>{
                const percentUpload = Math.round((snap.bytesTransferred/snap.totalBytes)*100);
                this.setState({percentUpload});
            },
            err=>{
                console.log(err)
                this.setState({
                    errors:this.state.errors.concat(err),
                    uploadState:"Error",
                    uploadTask:null
                })
            },
            ()=>{
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
                    this.sendFileMessage(downloadURL,ref,pathToUpload)
                })
                .catch(err=>{
                    this.setState({
                        errors:this.state.errors.concat(err),
                        uploadState:"Error",
                        uploadTask:null
                    })
                })
            })
        }
        )
    };

    sendFileMessage=(fileUrl,ref,pathToUpload)=>{
        ref.child(pathToUpload)
        .push()
        .set(this.createMessage(fileUrl))
        .then(()=>{
            this.setState({uploadState:'done'})
        })
        .catch(err=>{
            this.setState({
                errors:this.state.errors.concat(err)
            })
        })
    }

    render(){
        const{errors,message,loading,modal,uploadState,percentUpload} = this.state;
        return(
            <Segment className="messages__form">
                <Input 
                fluid
                name="message"
                onChange={this.handleChange}
                style={{marginBottom:'0.7em'}}
                label={<Button icon={"add"}/>}
                labelPosition="left"
                placeholder="Write Your Message"
                value={message}
                className={
                    errors.some(error=> error.message.includes('message'))?'error':''
                }
                />
                <Button.Group icon widths="2">
                    <Button
                    disabled={uploadState==='uploading'}
                    onClick={this.sendMessage}
                    color="orange"
                    content="Add Reply"
                    labelPosition="left"
                    disabled={loading}
                    icon="edit"/>
                    <Button 
                        onClick={this.openModal}
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon= "cloud upload"
                    />
                    
                </Button.Group>
                <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile}
                    />
                <ProgressBar
                    uploadState={uploadState}
                    percentUpload={percentUpload}

                />
            </Segment>
        );
    }
}

export default MessagesForm;