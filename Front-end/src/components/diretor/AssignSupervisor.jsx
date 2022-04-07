import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import seta from '../../uploads/SETA.png';
import { Link, Redirect } from 'react-router-dom';
import AssignModal from './ModalAssignSupervisor';

class AssignSupervisor extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            loading: false,
            auth: '',
            data: [], 
            sigla: '',
            showAssignSupervisorModal: false
        };
        this._assignSupervisorClick = this._assignSupervisorClick.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _assignSupervisorClick() {
        sessionStorage.setItem("AssignSupervisorModal", true);
        this.setState({
            showAssignSupervisorModal: true,
        }); 
    }

    render() {

        const submitForm = async (event) => {
            event.preventDefault();
            sessionStorage.setItem("sigla", this.state.sigla); 
            this._assignSupervisorClick();
        }

        const onChangeValue = (e) => {
            this.setState({
                [e.target.name]:e.target.value
            });
        }
        
        if (localStorage.getItem("sessionID")) {
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
                                                <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> ATRIBUIR ORIENTADOR</span></td>
                                                <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                                <Link to='/consultarcurso' onClick={() => {sessionStorage.removeItem("id_proposta"); sessionStorage.removeItem("title"); sessionStorage.removeItem("supervisor");}} style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <form id="form" onSubmit={submitForm}>
                                        <fieldset>
                                            <label htmlFor="sigla" className="mylabel">Sigla do Docente: </label><p></p>
                                            <input name="sigla" type="text" value={this.state.sigla} onChange={onChangeValue} tabIndex={0} required pattern="[a-z]{3}" />
                                        </fieldset>
                                        <fieldset>
                                            <button className="smallbutton" type="submit">Atribuir</button> 
                                        </fieldset>
                                    </form>
                                    {
                                        this.state.showAssignSupervisorModal ?
                                            <AssignModal />
                                        :
                                            null
                                    }
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

export default AssignSupervisor;