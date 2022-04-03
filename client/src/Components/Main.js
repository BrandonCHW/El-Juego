import React, { useEffect } from 'react';

function Main() {
    useEffect(() => {
        console.log('lobby is loaded')
    })

    return ( 
        <div className="Main">
          <h2>HELLO</h2>
          <p style={{color: "red", background: '#282c34'}}>inside lobby</p>
        </div> 
    );
}

export default Main;