import React from 'react'
import '../../css/Form.css';
import seta from '../../uploads/SETA.png';
import user from "../../uploads/user.svg"
import { Link } from 'react-router-dom';

const ChangeUser = () => {
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
                                        <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> ALTERAR DADOS DA SUA EMPRESA</span></td>
                                        <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                        <Link to='/dashboard' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="PostContent"> <br />
                        {/*----------------------------------------------------------------------------*/}
                            <style type="text/css" dangerouslySetInnerHTML={{__html: "\n        .auto-style1 {\n            width: 230px;\n            background-color: #0c518e;\n            transition: all 0.3s ease;\n        }\n        .auto-style1:hover {\n            width: 230px;\n            background-color: #C0C0C0;\n            transition: all 0.3s ease;\n        }\n        .auto-style2 {\n            width: 25px;\n        }\n        .auto-style3 {\n            height: 25px;\n        }\n        .table a {\n            display:block;\n            text-decoration:none;\n            color: #ffffff;\n            text-align: center;\n            font-family: verdana, geneva;\n            font-size: large;\n        }\n        .table td {\n           padding: 0px;\n        }\n" }} />
                            <br />
                            <table className="table" style={{borderCollapse: 'collapse'}} align="center">
                                <tbody>
                                    <tr>
                                        <td className="auto-style1" align="center" valign="middle">
                                            <Link to='/alterarempresa'>
                                                <br />
                                                <br />
                                                <img src={user} alt="" width={48} height={48} />
                                                <br />
                                                <br />
                                                <strong>Alterar dados <br/> da Empresa </strong>
                                                <br />
                                                <br />
                                                <br />
                                            </Link>
                                        </td>
                                        <td className="auto-style2"> </td>
                                        <td className="auto-style1" align="center" valign="middle">
                                            <Link to='/alterarlogin'>
                                                <br />
                                                <br />
                                                <img src={user} alt="" width={48} height={48} />
                                                <br />
                                                <br />
                                                <strong>Alterar dados <br/> do Login </strong>
                                                <br />
                                                <br />
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <br /><br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeUser;