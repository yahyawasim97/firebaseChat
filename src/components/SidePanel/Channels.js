import React,{Component} from 'react';
import { Menu, Icon ,Modal,Form,Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase'
import {connect} from 'react-redux';
import {setChannel}from '../../actions';

class Channels extends Component {
    
    state={
        channels:[],
        modal:false,
        channelDetails:'',
        channelName:'',
        channelRefs: firebase.database().ref('channels'),
        user: this.props.currentUser,
        firstLoad:true,
        activeChannel:''
    }
    componentDidMount(){
        this.addListeners();
    }
    componentWillUnmount(){
        this.removeListener();
    }
    removeListener=()=>{
        this.state.channelRefs.off();
    }
    addListeners=()=>{
        let loadedChannels= [];
        this.state.channelRefs.on('child_added',snap=>{
            loadedChannels.push(snap.val());
            this.setState({
                channels:loadedChannels
            },()=>this.setFirstChannel())
        })
    }

    setFirstChannel=()=>{
        const firstChannel= this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length>0){
            this.props.setChannel(firstChannel)
            this.setActiveChannel(firstChannel)
        }
        this.setState({firstLoad:false})
    }
    addChannel=()=>{
        const {channelRefs,channelName,channelDetails,user} =this.state;
        const key = channelRefs.push().key;
        const  newChannel ={
            id:key,
            name: channelName,
            details:channelDetails,
            createdBy:{
                name: user.displayName,
                avatar: user.photoURL
            }
        }
        channelRefs.child(key).update(newChannel)
        .then(()=>{
            this.setState({channelName:'',channelDetails:''})
            this.closeModal();
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    handleSubmit=(event)=>{
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.addChannel();
            console.log('channel Added')
        }else{

        }
    }

    isFormValid=({channelName,channelDetails})=>channelName && channelDetails
    openModal=()=>{
        this.setState({
            modal:true
        })
    }
    closeModal=()=>{
        this.setState({
            modal:false
        })
    }
    handleChange= event=>{
        this.setState({[event.target.name]:event.target.value})
    }
    displayChannels=channels=>(
        channels.length>0 && channels.map(channel=>(
            <Menu.Item
                key={channel.id}
                onClick={()=>this.changeChannel(channel)}
                name= {channel.name}
                style={{opacity:0.7}}
                active={channel.id ===this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    changeChannel= channel=>{
        this.setActiveChannel(channel);
        this.props.setChannel(channel);
    }
    setActiveChannel=(channel)=>{
        this.setState({activeChannel:channel.id})
    }
    render(){
        const {channels,modal} = this.state;
        return(
            <React.Fragment>
            <Menu.Menu style={{paddingBottom:'2em'}}>
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> Channels
                    </span>{" "}
                    ({channels.length}) <Icon name="add" onClick={this.openModal}/>
                </Menu.Item>
                {this.displayChannels(channels)}
            </Menu.Menu>
            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input
                                fluid
                                name="channelName"
                                label="Name of Channel"
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                fluid
                                label="About the Channel"
                                name="channelDetails"
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark" /> Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </React.Fragment>
        );
    }
}
export default connect(null,{setChannel})(Channels)