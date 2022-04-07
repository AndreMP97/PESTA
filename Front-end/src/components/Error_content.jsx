import React from 'react';
import svg from '../uploads/error.svg';

function Error() {
    return (
        <div>
            <img src={svg} alt="" className="center"/>
            <h1 style={{textAlign: 'center'}}>Occorreu um erro! Tente novamente!</h1>
        </div>
    );
}

export default Error;