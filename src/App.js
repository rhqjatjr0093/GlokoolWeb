import React, { Component } from 'react';
import Login from './pages/login';
import Home from "./pages/home";
import './App.css'
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import {auth}  from './Firebase'


function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} />
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
        : <Redirect to='/home' />}
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
      <Router>
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <PrivateRoute path="/home" authenticated={this.state.authenticated} component={Home}></PrivateRoute>
          <PublicRoute path="/login" authenticated={this.state.authenticated} component={Login}></PublicRoute>
        </Switch>
      </Router>
    );
  }
}

export default App;
