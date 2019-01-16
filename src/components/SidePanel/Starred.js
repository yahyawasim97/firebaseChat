import React,{Component} from 'react';
import {Menu,Icon} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setChannel,setPrivateChannel} from '../../actions'
class Starred extends Component{
    state={
        activeChannel:'',
        starredChannels:[]
    }
    setActiveChannel=(channel)=>{
        this.setState({activeChannel:channel.id})
    }
    displayChannels=starredChannels=>(
        starredChannels.length>0 && starredChannels.map(channel=>(
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
        this.props.setPrivateChannel(false);

    }

    render(){
        const {starredChannels} = this.state;
        return( 
        <Menu.Menu className="menu">
            <Menu.Item>
                <span>
                    <Icon name="star"/> Starred
                </span>{" "}
                ({starredChannels.length}) 
            </Menu.Item>
            {this.displayChannels(starredChannels)}
        </Menu.Menu>
    );}
}
export default connect(null,{setChannel,setPrivateChannel})(Starred);