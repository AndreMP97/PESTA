import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import seta from '../../uploads/SETA.png';
import { Link, Redirect } from 'react-router-dom';
import PendingAproval from "./ListRequestsPendingAproval";
import PendingFeedback from "./ListRequestsPendingFeedback";
import Feedback from "./ListRequestsWithFeedback";
import Rejected from './ListRequestsRejected';

class ListRequests extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            tabletype: sessionStorage.getItem("tabletype") || "active"
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    populateProposals() {
        if (this.state.tabletype === "active") {
            return(<PendingAproval />)
        }

        else if (this.state.tabletype === "request") {
            return(<PendingFeedback />)
        }

        else if (this.state.tabletype === "answered") {
            return(<Feedback />)
        }

        else if (this.state.tabletype === "rejected") {
            return(<Rejected />)
        }

    }

    render() {

        const onChangeValue = (e) => {
            this.setState({
                [e.target.name]:e.target.value
            }
            , 
            () => {
                sessionStorage.setItem("tabletype", this.state.tabletype);
            });
        }

        if(localStorage.getItem("sessionID")) {
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
                                                <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> Pedidos de Estágio</span></td>
                                                <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                                <Link to='/dashboard' onClick={() => {sessionStorage.removeItem("typeProposal"); sessionStorage.removeItem("tabletype");}} style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                        <select className="tableselect" name="tabletype" id="tabletype" tabIndex={0} value={this.state.tabletype} onChange={onChangeValue} style={{color: '#124F87'}}>
                                            <option value="active"> Estágios por aprovar </option>
                                            <option value="request"> Estágios com pedido de parecer </option>
                                            <option value="answered"> Estágios com parecer </option>
                                            <option value="rejected"> Estágios rejeitados </option>
                                        </select>
                                        {this.populateProposals()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    
        else {
            return(
                <Redirect to="/404" />
            );
        }    
    }

}

export default ListRequests;