import React from 'react';
import { Link } from 'react-router-dom';
import seta from '../uploads/SETA.png';

function Sidebar_auth() {
    return (
        <div className="sidebar1">
        {/*--------------------------------blocos laterais-------------------------------------*/}
        {/*--------------------------------quick nav links--------------------------------------*/}
        <div className="Block">
            <div className="Block-body">
                <div className="BlockHeader">
                    <div className="header-tag-icon">
                        <div className="BlockHeader-text">
                            <span style={{fontFamily: 'verdana, geneva', fontSize: 'x-small'}}>Acesso rápido para:</span>
                        </div>
                    </div>
                    <div className="l" />
                    <div className="r">
                        <div /></div>
                    </div>
            </div>
        </div>
        <div className="Block">
            <div className="Block-body">
                <div className="BlockHeader">
                    <div className="header-tag-icon">
                        <div className="BlockHeader-text">
                            <img src={seta} alt=""/> 
                            <Link to='/dashboard' style={{color: 'white', textDecoration: 'none', fontFamily: 'Verdana'}}> Perfil</Link>
                        </div>
                    </div>
                    <div className="l" />
                    <div className="r"><div /></div>
                </div>
            </div>
        </div>
        <div className="Block">
            <div className="Block-body">
                <div className="BlockHeader">
                    <div className="header-tag-icon">
                        <div className="BlockHeader-text">
                            <img src={seta} alt=""/> 
                            <Link to="/logout" onClick={ () => {sessionStorage.setItem("logout", "logout");} } style={{color: 'white', textDecoration: 'none', fontFamily: 'Verdana'}}> Logout</Link>
                        </div>
                    </div>
                    <div className="l" />
                    <div className="r"><div /></div>
                </div>
            </div>
        </div>               
        <br />
        {/*<!----------------------------------ligações úteis---------------------------------------->]*/}
        <div className="Block">
            <div className="Block-body">
                <div className="BlockHeader">
                    <div className="header-tag-icon">
                        <div className="BlockHeader-text">
                            <img src={seta} alt=""/>   Ligações Úteis
                        </div>
                    </div>
                    <div className="l" />
                    <div className="r"><div /></div>
                    </div>
                <div className="BlockContent">
                    <div className="BlockContent-body">
                        <div>
                            <ul>
                                <li className="lista"><a target="_blank" rel="noreferrer" href="https://moodle.isep.ipp.pt/acesso/">Moodle ISEP</a></li>
                                <li className="lista"><a target="_blank" rel="noreferrer" href="https://videoconf-colibri.zoom.us/join">Colibri FCCN - ZOOM</a></li>
                                <li className="lista"><a target="_blank" rel="noreferrer" href="https://portal.isep.ipp.pt/intranet/">Portal ISEP</a></li>
                                <li className="lista"><a target="_blank" rel="noreferrer" href="https://www.isep.ipp.pt/">Website ISEP</a></li>
                                <li className="lista"><a target="_blank" rel="noreferrer" href="https://outlook.office365.com/">Email ISEP</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/*<!-------------------------Fim do menu lateral--------------------->*/}
    </div> 
    );
}

export default Sidebar_auth;