
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

// todo change class name from playercard to card (generic)
/**
 * A playing card (value: 1-100)
 * @param {*} param0 
 * @returns 
 */
function PlayerCard(props) {
    let color = !props.isCenterCard ? 'yellow' : 'lime'
    
    return (
        <Button 
            variant='light'
            onClick={props.onClick}
            >
            {props.value}
        </Button>
    )
}

export default PlayerCard