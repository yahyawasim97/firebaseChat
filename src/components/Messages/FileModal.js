import React,{Component} from 'react';
import {Modal,Input,Button,Icon} from 'semantic-ui-react';

class FileModal extends Component{
    render(){
        const {modal,closeModal} = this.props;
        return(
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an Image</Modal.Header>
                <Modal.Content>
                    <Input
                    fluid
                    label="File Types: jpg,png"
                    name="file"
                    type="file"/>
                    
                </Modal.Content>

            </Modal>
        );
    }
}
export default FileModal;