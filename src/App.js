import React, { Component } from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect
} from "react-router-dom";
import { Home, Auth, Main, Email } from './pages';
import { auth } from './Firebase';

function PrivateRoute({ component: Component, authenticated, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) => authenticated === true
          ? <Component {...props}/>
          : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
      />
    )
  }
  
  function PublicRoute({ component: Component, authenticated, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) => authenticated === false
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
      />
    )
  }

class App extends Component {
    constructor() {
        super();
        this.state = {
          authenticated: false,
          loading: true
        };
      }
    
      componentDidMount() {
        auth().onAuthStateChanged(user => {
          if (user) {
            this.setState({
              authenticated: true,
              loading: false
            });
          } else {
            this.setState({
              authenticated: false,
              loading: false
            });
          }
        });
      }

    render() {
        return this.state.loading === true ? <h2>Loading...</h2> : (
            <div>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home}></Route>
                        <PublicRoute path="/auth" authenticated={this.state.authenticated} component={Auth}></PublicRoute>
                        <PrivateRoute path="/email" authenticated={this.state.authenticated} component={Email}></PrivateRoute>
                        <PrivateRoute path="/main" authenticated={this.state.authenticated} component={Main}></PrivateRoute>                        
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;