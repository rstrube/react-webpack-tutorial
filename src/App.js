import React from 'react';
import './styles/App.scss';

export const App = () => {

    const dateTime = new Date().toString();

    return (
        <div className="App">
            <h1 className="App-header">React Webpack Tutorial</h1>
            <p className="App-dateTime">Page loaded at: <code>{dateTime}</code></p>
        </div>
    );
}
