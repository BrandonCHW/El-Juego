import React, { useEffect, useState } from 'react';
import ButtonTest from './ButtonTest';

function TheTest() {
    const [globalCount, setGlobalCount] = useState(0)

    useEffect(() => {
        console.log('test is loaded')
    })

    const handleClick = () => {
        console.log('globalCount: ', globalCount)
        setGlobalCount(globalCount+1)
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
            <ButtonTest onClick={handleClick}></ButtonTest>
        </>
    );
}

export default TheTest;