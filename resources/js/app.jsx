import './bootstrap';


import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from "./Main";

if (document.getElementById('app')) {
    import('./bootstrap').then(() => {
        ReactDOM.createRoot(document.getElementById('app')).render(
            <React.StrictMode>
                <Main />
            </React.StrictMode>
        );
    });
} else {
    console.error('Element with id "app" not found.');
}
//ReactDOM.createRoot(document.getElementById('app')).render(<Main />);
