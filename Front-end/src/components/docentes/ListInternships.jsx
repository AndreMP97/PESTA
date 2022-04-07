import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import seta from '../../uploads/SETA.png';
import { Link, withRouter, Redirect } from 'react-router-dom';
import Loading from "../Loading";
import ActiveInternship from "./ListInternshipsActive";
import ConcludedInternship from "./ListInternshipsConcluded";

class ListProposals extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: false, 
            data: [],
            tabletype: sessionStorage.getItem("tabletype") || "active"
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    populateInternships() {
        if (this.state.tabletype === "active") {
            return(<ActiveInternship />);
        }

        else if (this.state.tabletype === "concluded") {
            return(<ConcludedInternship />);
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
                                                <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> OS MEUS ESTÁGIOS</span></td>
                                                <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                                <Link to='/dashboard' onClick={() => {sessionStorage.removeItem("tabletype");}} style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                        <select className="tableselect" name="tabletype" id="tabletype" tabIndex={0} value={this.state.tabletype} onChange={onChangeValue} style={{color: '#124F87'}}>
                                            <option disabled hidden value=""> -- Selecione uma tabela -- </option>
                                            <option value="active">Estágios a orientar</option>
                                            <option value="concluded">Estágios orientados concluídos</option>
                                        </select>
                                        {this.populateInternships()}
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

        else if(!sessionStorage.getItem("typeProposal"))  {
            return(
                <Redirect to="/dashboard" />
            )
        }
    
        else {
            return(
                <Redirect to="/404" />
            );
        }    
    }

}

export default withRouter(ListProposals);