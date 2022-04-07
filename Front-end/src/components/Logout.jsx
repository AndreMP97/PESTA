import React, { Component } from 'react';
import '../css/Form.css';
import '../css/Table.css';
import seta from '../uploads/SETA.png';
import svg from '../uploads/logout.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from "./Loading";

class Logout_proto extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: true,
            type: sessionStorage.getItem("logout") || 'expired',
            data: []
        };
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.post(window.website.concat("logout.php"))
                .then(request => {
                    if (request.data.success && this._isMounted) {
                        this.setState({ 
                            loading: false, 
                            data: request.data
                        });
                        //console.log("debug", request.data);
                        localStorage.clear();
                        sessionStorage.clear();
                    }
            });
        } 

        catch (error) {
            console.error(error);
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if (this.state.loading === false && this.state.type === "logout") {
            return(
                <div className="content">
                {/*-----------------------barra superior da página 'content'-------------------*/}
                <div className="Post">
                    <div className="Post-body">
                        <div className="Post-inner">
                        <div className="PostHeaderIcon-wrapper"> 
                            <table style={{width: '100%', height: '20px', borderCollapse: 'collapse'}}>
                                <tbody>
                                    <tr>
                                        <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> LOGOUT!</span></td>
                                        <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                        <Link to='/login' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                            <div className="PostContent"> <br />
                            {/*----------------------------------------------------------------------------*/}
                            <img src={svg} alt="" className="center"/>
                            <h1 style={{textAlign: 'center'}}>A sua sessão foi terminada!</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );
        }

        else if (this.state.loading === false && this.state.type === "expired") {
            return(
                <div className="content">
                {/*-----------------------barra superior da página 'content'-------------------*/}
                <div className="Post">
                    <div className="Post-body">
                        <div className="Post-inner">
                        <div className="PostHeaderIcon-wrapper"> 
                            <table style={{width: '100%', height: '20px', borderCollapse: 'collapse'}}>
                                <tbody>
                                    <tr>
                                        <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> LOGOUT!</span></td>
                                        <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                        <Link to='/login' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                            <div className="PostContent"> <br />
                            {/*----------------------------------------------------------------------------*/}
                            <img src={svg} alt="" className="center"/>
                            <h1 style={{textAlign: 'center'}}>A sua sessão expirou!</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );
        }

        else if (this.state.loading === true) {
            return(
                <Loading />
            )
        }

    }

}

export default Logout_proto;