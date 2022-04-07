import React from 'react';
import seta from '../uploads/SETA.png';
import svg from '../uploads/404.svg';
import { Link } from 'react-router-dom';

function PageNotFound() {
    return (
        <div className="content">
            {/*-----------------------barra superior da página 'content'-------------------*/}
            <div className="Post">
                <div className="Post-body">
                    <div className="Post-inner">
                    <div className="PostHeaderIcon-wrapper"> 
                        <table style={{width: '100%', height: '20px', borderCollapse: 'collapse'}}>
                            <tbody>
                                <tr>
                                    <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> ERRO!</span></td>
                                    <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                    <Link to='/' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <div className="PostContent"> <br />
                        {/*----------------------------------------------------------------------------*/}
                        <img src={svg} alt="" className="center"/>
                        <h1 style={{textAlign: 'center'}}>Página não encontrada!</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PageNotFound;