import React from 'react';

function Nav() {

    const checkuser = () => {
        if (localStorage.getItem("username")) {
            return(
                <span className="mynav">BEM-VINDO {localStorage.getItem("username").toUpperCase()}</span>
            );
        }
    }

    if(localStorage.getItem("username")) {
        return ( 
            <div>
                <ul className="artmenu">
                <li>
                    <a href="https://www.dee.isep.ipp.pt" target="_blank" rel="noreferrer"><span><span>Início</span></span></a>
                </li>
                <li />
                {checkuser()}
                </ul>
                <div className="l"> </div>
                <div className="r">
                <div>
                </div>    
                </div>     
            </div>
        )
    }

    else {
        return (
            <div>
                <ul className="artmenu">
                <li>
                    <a href="https://www.dee.isep.ipp.pt" target="_blank" rel="noreferrer"><span><span>Início</span></span></a>
                </li>
                <li />
                </ul>
                <div className="l"> </div>
                <div className="r">
                <div>
                </div>    
                </div>     
            </div>
        )
    }
}

export default Nav;