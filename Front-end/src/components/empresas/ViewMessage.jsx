import React, { Component } from 'react';
import seta from '../../uploads/SETA.png';
import { Link, Redirect} from 'react-router-dom';
import Loading from "../Loading";
import axios from 'axios';
import Error from "../Error";

class ViewMessage extends Component {
    constructor() {
        super();
        this.state = { 
            loading: true,
            error: false,
            auth: '', 
            message: ''
        };
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("empresas/vermensagem.php"),{
                params: {
                    id:sessionStorage.getItem("id_proposta"),
                    student:sessionStorage.getItem("student")
                }
            })
                .then(request => {
                    if (request.data.success && this._isMounted) {
                        if (request.data.message !== null) {
                            this.setState({ 
                                loading: false, 
                                auth: request.data.auth,
                                message: request.data.message
                            });
                        }
                        else {
                            this.setState({ 
                                loading: false, 
                                auth: request.data.auth,
                                message: ''
                            });
                        }
                    }
                    else if (!request.data.success && this._isMounted) {
                        this.setState({ 
                            loading: false, 
                            error: true
                        });
                    }
                    //console.log("debug", request);
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

        if(this.state.auth && this.state.loading === false && this.state.error === false) {
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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> Ver Mensagem</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/vercandidatos' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                <form id="form">
                                    <fieldset>
                                        <label htmlFor="message" className="mylabel">Mensagem: </label><p></p>
                                        <input name="message" type="text" value={this.state.message} readOnly/>
                                    </fieldset>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else if(this.state.loading === true)  {
            return(
                <Loading />
            )
        }

        else if (!this.state.auth && this.state.error === false) {
            return(
                <Redirect to="/logout" />
            )
        }

        else if (this.state.error === true) {
            return(
                <Error />
            )
        }

        else {
            return(
                <Redirect to="/404" />
            );
        }

    }

}

export default ViewMessage;