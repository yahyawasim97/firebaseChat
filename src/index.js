import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
import firebase from './firebase';

import { BrowserRouter as Router, Route ,Switch,withRouter} from 'react-router-dom';
import {createStore} from 'redux';
import {Provider,connect} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {setUser,clearUser} from './actions/index';
import Spinner from './Spinner';

class Root extends Component{
    
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.props.setUser(user);
                this.props.history.push('/');
            }
            else{
                
                this.props.history.push('/login');
                this.props.clearUser();
            }
        })
    }
    
    render(){
        return this.props.isLoading ?<Spinner/>:(

            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>
        );
    }
}

const store = createStore(rootReducer,composeWithDevTools())

const mapStateToProps=(state)=>({
    isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(connect(mapStateToProps,{setUser,clearUser})(Root));

ReactDOM.render(
<Provider store={store}>
<Router><RootWithAuth /></Router>
</Provider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
