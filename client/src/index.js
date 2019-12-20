import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import IpdApp from './ipdApp';
import * as serviceWorker from './serviceWorker';
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "../node_modules/drizzle-react";
import drizzleOptions from "./drizzleOptions";

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

console.log('version: ', React.version);

ReactDOM.render(

        <IpdApp drizzle={drizzle} />,

    document.getElementById('root')
    
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
