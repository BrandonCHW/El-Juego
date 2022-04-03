
import Card from './PlayerCard'
import { useState, useEffect } from 'react'

function PlayerHand({ name, hand}) {
    useEffect = (() => {
        // console.log(hand)
    })

    return (
        <div>
            <label>{name}: </label>
            { hand[0] ? <Card value={hand[0]}/> : <></>}
            { hand[1] ? <Card value={hand[1]}/> : <></>}
            { hand[2] ? <Card value={hand[2]}/> : <></>}
            { hand[3] ? <Card value={hand[3]}/> : <></>}
            { hand[4] ? <Card value={hand[4]}/> : <></>}
            { hand[5] ? <Card value={hand[5]}/> : <></>}
        </div>
    );
}

export default PlayerHand;