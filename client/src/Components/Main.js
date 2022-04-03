import React, { useEffect } from 'react';

function Main() {
    useEffect(() => {
        console.log('lobby is loaded')
    })

    return ( 
        <div className="Main">
          <h2>HELLO</h2>
          <p>inside lobby</p>
        </div> 
    );
}

export default Main;