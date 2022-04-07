import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import seta from '../../uploads/SETA.png';
import { Link, Redirect } from 'react-router-dom';
import WithCandidates from './ListProposalsWithCandidates';
import WithoutCandidates from './ListProposalsWithoutCandidates'
import Archived from './ListProposalsArchived';
import Assigned from './ListProposalsAssigned';
import Concluded from './ListProposalsConcluded';

class ListProposalsApproved extends Component {
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

    populateProposals() {

        if (this.state.tabletype === "active") {
            return(<WithCandidates />)
        }

        else if (this.state.tabletype === "candidates") {
            return(<WithoutCandidates />)
        }

        else if (this.state.tabletype === "archived") {
            return(<Archived />)
        }

        else if (this.state.tabletype === "assigned") {
            return(<Assigned />)
        }

        else if (this.state.tabletype === "concluded") {
            return(<Concluded />)
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
                                                <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> AS MINHAS PROPOSTAS DE ESTÁGIO CURRICULAR APROVADAS</span></td>
                                                <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                                <Link to='/dashboard' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                        <select className="tableselect" name="tabletype" id="tabletype" tabIndex={0} value={this.state.tabletype} onChange={onChangeValue} style={{color: '#124F87'}}>
                                            <option disabled hidden value=""> -- Selecione uma tabela -- </option>
                                            <option value="active">Estágios com candidatos</option>
                                            <option value="candidates">Estágios sem candidatos</option>
                                            <option value="archived">Estágios ocultados</option>
                                            <option value="assigned">Estágios atríbuidos </option>
                                            <option value="concluded">Estágios concluídos</option>
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

export default ListProposalsApproved;