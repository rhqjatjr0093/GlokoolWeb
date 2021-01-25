import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import './index.css';
import configureStore from './redux/configureStore';
import reportWebVitals from './reportWebVitals';

const store = configureStore();

ReactDOM.render(<Root store={store}/>, document.getElementById('root'));
reportWebVitals();