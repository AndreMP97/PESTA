import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import seta from '../../uploads/SETA.png';
import { Link, Redirect } from 'react-router-dom';
import Loading from "../Loading";
import axios from 'axios';
import AssignModal from './ModalAssign';
import Error from "../Error";

class ViewCandidates extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: true, 
            error: false,
            auth: '', 
            data: [],
            num: ""
        };
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            const request = await axios.get(window.website.concat("docentes/vercandidatos.php"),{
                params: {
                    id:sessionStorage.getItem("id_proposta"),
                }
            });
            if (request.data.success && this._isMounted) {
                this.setState({ 
                    loading: false, 
                    auth: request.data.auth,
                    data: request.data 
                });
            }
            else if (!request.data.success && this._isMounted) {
                this.setState({ 
                    loading: false, 
                    error: true
                });
            }
            //console.log("debug", request);
        } 

        catch (error) {
            console.error(error);
        };

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _assignClick() {
        sessionStorage.setItem("AssignModal", true);
        this.setState({
            showAssignModal: true,
        }); 
        //console.log("entrou", this.state.showAssignModal);
    }

    populateCandidates() {
        const num = Object.values(this.state.data.num);
        const name = Object.values(this.state.data.name);
        const date = Object.values(this.state.data.date);
        var entries = [];

        if(num.length === 0) {
            entries.push(
                <tr key = {0}>
                    <td className="errorMsg">Nenhum candidato à sua proposta!</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        }

        for (var i = 0; i < num.length; i++) {
            const student = num[i];
            entries.push(
            <tr key={i}>
                <td>
                    <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{num[i]}</span>
                </td>
                <td>
                    <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{name[i]}</span>
                </td>
                <td>
                    <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{date[i]}</span>
                </td>
                <td> 
                    <Link to='/vermensagem'>
                        <button onClick={() => {sessionStorage.setItem("student", student);}} className="smallbutton" type="submit" >Ver</button>
                    </Link>      
                </td>
                <td>
                    <button onClick={() => {sessionStorage.setItem("student", student); this._assignClick();}} className="smallbutton" type="submit">Atribuir </button> 
                </td>
            </tr>
            );
        }

        return(<tbody>{entries}</tbody>);
    }

    render() {

        const submitForm = async (event) => {
            event.preventDefault();
            sessionStorage.setItem("student", this.state.num); 
            this._assignClick();
        }

        const onChangeValue = (e) => {
            this.setState({
                num:e.target.value
            });
        }
        
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
                                                <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> CANDIDATOS AO PROJETO</span></td>
                                                <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                                <Link to='/consultarpropostas' onClick={() => {sessionStorage.removeItem("id_proposta"); sessionStorage.removeItem("title"); sessionStorage.removeItem("student");}} style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <table className="mytable">
                                        <thead>
                                            <tr>
                                                <th>Número </th>
                                                <th>Nome </th>
                                                <th>Data da Candidatura </th>
                                                <th>Mensagem </th>
                                                <th>Atribuir Aluno</th>
                                            </tr>
                                        </thead>
                                        {this.populateCandidates()}
                                    </table>
                                    <br />
                                    <form id="form" onSubmit={submitForm}>
                                        <fieldset>
                                            <label htmlFor="num" className="mylabel">Nº do Aluno: </label><p></p>
                                            <input name="num" type="text" value={this.state.num} onChange={onChangeValue} tabIndex={0} required pattern="[0-9]{7}" />
                                        </fieldset>
                                        <fieldset>
                                            <button className="smallbutton" type="submit">Atribuir </button> 
                                        </fieldset>
                                    </form>
                                    {
                                        this.state.showAssignModal ?
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

export default ViewCandidates;