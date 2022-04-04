import React, { useEffect, useState } from 'react';
import CenterBoard from './CenterBoard';
import PlayerCard from './PlayerCard';
import TestComponent from './TestComponent';


function TheTest() {
    const [testValue, setTestValue] = useState(0)
    const [childCount, setChildCount] = useState(0)

    useEffect(() => {
        console.log('test is loaded')
    })

    const handleClick = (val) => {
        console.log('click')
        setTestValue(val)
    }

    const callback = (count) => {
        console.log(count)
        // setChildCount(count)
    }

    return ( 
        <div>
          <h2>HELLO</h2>
          <p>Cras facilisis urna ornare ex volutpat, et
          convallis erat elementum. Ut aliquam, ipsum vitae
          gravida suscipit, metus dui bibendum est, eget rhoncus nibh
          metus nec massa. Maecenas hendrerit laoreet augue
          nec molestie. Cum sociis natoque penatibus et magnis
          dis parturient montes, nascetur ridiculus mus.</p>
   
          <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
          <TestComponent parentCallback={callback}></TestComponent>
          <CenterBoard onSelectPile={handleClick}></CenterBoard>
        </div> 
    );
}

export default TheTest;