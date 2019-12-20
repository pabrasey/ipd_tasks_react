import React from "react";
import IpdApp from './ipdApp';
import { DrizzleContext } from "drizzle-react";

const App = () => (

//DrizzleContext Consumer gives us access to our drizzle objects

    <DrizzleContext.Consumer>
    {
        drizzleContext => 
        {
        const { drizzle, 
                drizzleState, 
                initialized } = drizzleContext;
        //return a loading UI if drizzle is not yet initialised
        if(!initialized){
            return "Loading...";
        }
        
        //pass drizzle down as props into a subcomponent
        return (
        <IpdApp 
            drizzle={drizzle} 
            drizzleState={drizzleState} 
        />)
        }
    }
    </DrizzleContext.Consumer>
)

export default App;