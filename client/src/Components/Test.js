import React, { useEffect, useState } from 'react';
import ButtonTest from './ButtonTest';
import CenterBoard from './CenterBoard';
import TestComponent from './TestComponent';

function TheTest() {
    const [globalCount, setGlobalCount] = useState(0)
    const [testValue, setTestValue] = useState({value: -1})

    useEffect(() => {
        console.log('test is loaded')
    })

    const handleClick = (val) => {
        console.log('globalCount: ', globalCount)
        setGlobalCount(val+1)
    }

    const handleClick2 = (something) => {
        setTestValue({value: something})
        console.log('selected pile')
    }

    return ( 
        <>
            <div>
            <h2>HELLO</h2>
            <p>Cras facilisis urna ornare ex volutpat, et
            convallis erat elementum. Ut aliquam, ipsum vitae
            gravida suscipit, metus dui bibendum est, eget rhoncus nibh
            metus nec massa. Maecenas hendrerit laoreet augue
            nec molestie. Cum sociis natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus.</p>
    
            <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
            </div> 
            <ButtonTest onClick={handleClick} onSelectPile={handleClick2}></ButtonTest>
            <TestComponent parentCallback={handleClick}></TestComponent>
            <CenterBoard onSelectPile={handleClick}></CenterBoard>
        </>
    );
}

export default TheTest;