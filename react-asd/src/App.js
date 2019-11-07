import React from 'react';
import ReactDOM from 'react-dom';

const App = (props) => {
    return <div>Hello,{props.name}</div>
}
ReactDOM.render(
    <App name="Ilya" />,
    document.getElementById('root'));