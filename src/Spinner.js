import React from 'react';
import {Loader, Dimmer,Image,} from 'semantic-ui-react';
import loader from './assets/loader.gif'

const Spinner=()=>(
    <Dimmer active>
        <Image style={{ filter: 'invert(100%)'}} src={loader}/>
        <h2>Preparing Chat...</h2>
    </Dimmer>
)
export default Spinner;