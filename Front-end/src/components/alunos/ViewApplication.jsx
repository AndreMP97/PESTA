import React, { Component } from 'react';
import seta from '../../uploads/SETA.png';
import { Link, Redirect } from 'react-router-dom';
import Loading from "../Loading";
import axios from 'axios';
import CancelModal from './CancelModal';
import Error from "../Error";

class ViewApplication extends Component {
    constructor() {
        super();
        this.state = { 
            loading: true, 
            auth: '',
            data: [],
            error: false,
            showCancelModal: false
        };
        this._cancelModalClick = this._cancelModalClick.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("alunos/candidatura.php"))
                .then(request => {
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
                    //console.log("debug", request.data);
            });
        } 

        catch (error) {
            console.error(error);
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _cancelModalClick() {
        sessionStorage.setItem("CancelModal", true);
        this.setState({
            showCancelModal: true
        });  
    }

    render() {

        if(this.state.auth && this.state.loading === false && this.state.data.isCandidate && this.state.data.type === "internship") {
            return (
                <div className="content">
                    {/*-----------------------barra superior da p??gina 'content'-------------------*/}
                    <div className="Post">
                        <div className="Post-body">
                            <div className="Post-inner">
                            <div className="PostHeaderIcon-wrapper"> 
                                <table style={{width: '100%', height: '20px', borderCollapse: 'collapse'}}>
                                    <tbody>
                                        <tr>
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> A minha candidatura</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/dashboard' onClick={ () => {sessionStorage.removeItem("id_proposta");} }style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <form id="form">
                                        <fieldset>
                                            <label htmlFor="message" className="mylabel">Mensagem: </label><p></p>
                                            <input name="message" type="text" value={this.state.data.message} readOnly/>
                                        </fieldset>
                                        <hr />
                                        <fieldset>
                                            <label htmlFor="course" className="mylabel">Curso: </label><p></p>
                                            <select name="course" id="course" tabIndex={0} defaultValue={this.state.data.course} disabled>
                                                <option value="LEEC">LICENCIATURA EM ENGENHARIA ELETROT??CNICA E DE COMPUTADORES</option>
                                                <option value="LEESEE">LICENCIATURA EM ENGENHARIA ELETROT??CNICA - SISTEMAS EL??CTRICOS DE ENERGIA</option>
                                                <option value="LETI">LICENCIATURA EM ENGENHARIA DE TELECOMUNICA????ES E INFORM??TICA</option>
                                                <option value="MEEC">MESTRADO EM ENGENHARIA ELETROT??CNICA E DE COMPUTADORES</option>
                                                <option value="MEESEE">MESTRADO EM ENGENHARIA ELETROT??CNICA - SISTEMAS EL??TRICOS DE ENERGIA</option>
                                            </select>
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="title" className="mylabel">T??tulo: </label><p></p>
                                            <input name="title" defaultValue={this.state.data.title} type="text" readOnly/>
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="detail" className="mylabel">Breve descri????o do trabalho: </label><p></p>
                                            <textarea name="detail" defaultValue={this.state.data.detail} readOnly/>          
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="company" className="mylabel">Nome da Empresa: </label><p></p>
                                            <input name="company" type="text" value={this.state.data.company} readOnly />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="street" className="mylabel">Endere??o: </label><p></p>
                                            <input name="street" type="text" value={this.state.data.street} readOnly />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="email" className="mylabel">Email: </label><p></p>
                                            <input name="email" type="email" value={this.state.data.email}  readOnly />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="website" className="mylabel">Website: </label><p></p>
                                            <input name="website" type="text" value={this.state.data.website}  readOnly />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="supervisor" className="mylabel">Nome do supervisor na empresa: </label><p></p>
                                            <input name="supervisor" type="text" value={this.state.data.supervisor} readOnly />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="phone" className="mylabel">Contato telef??nico: </label><p></p>
                                            <input name="phone" type="tel" value={this.state.data.phone} readOnly/>
                                        </fieldset>
                                        <fieldset>
                                            <button onClick={() => {sessionStorage.setItem("id_proposta", this.state.data.id); this._cancelModalClick(); sessionStorage.setItem("title", this.state.data.title);}} className="smallbutton" type="button">Cancelar candidatura</button>
                                            { this.state.showCancelModal ?
                                                    <CancelModal/> 
                                                :
                                                    null
                                            }
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else if(this.state.auth && this.state.loading === false && this.state.data.isCandidate && this.state.data.type === "project") {
            return (
                <div className="content">
                    {/*-----------------------barra superior da p??gina 'content'-------------------*/}
                    <div className="Post">
                        <div className="Post-body">
                            <div className="Post-inner">
                            <div className="PostHeaderIcon-wrapper"> 
                                <table style={{width: '100%', height: '20px', borderCollapse: 'collapse'}}>
                                    <tbody>
                                        <tr>
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> A minha candidatura</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/dashboard' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <form id="form">
                                        <fieldset>
                                            <label htmlFor="message" className="mylabel">Mensagem: </label><p></p>
                                            <input name="message" type="text" value={this.state.data.message} readOnly/>
                                        </fieldset>
                                        <hr />
                                        <fieldset>
                                            <label htmlFor="course" className="mylabel">Curso: </label><p></p>
                                            <select name="course" id="course" tabIndex={0} defaultValue={this.state.data.course} disabled>
                                                <option value="LEEC">LICENCIATURA EM ENGENHARIA ELETROT??CNICA E DE COMPUTADORES</option>
                                                <option value="LEESEE">LICENCIATURA EM ENGENHARIA ELETROT??CNICA - SISTEMAS EL??CTRICOS DE ENERGIA</option>
                                                <option value="LETI">LICENCIATURA EM ENGENHARIA DE TELECOMUNICA????ES E INFORM??TICA</option>
                                                <option value="MEEC">MESTRADO EM ENGENHARIA ELETROT??CNICA E DE COMPUTADORES</option>
                                                <option value="MEESEE">MESTRADO EM ENGENHARIA ELETROT??CNICA - SISTEMAS EL??TRICOS DE ENERGIA</option>
                                            </select>
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="title" className="mylabel">T??tulo: </label><p></p>
                                            <input name="title" defaultValue={this.state.data.title} type="text" readOnly/>
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="detail" className="mylabel">Breve descri????o do trabalho: </label><p></p>
                                            <textarea name="detail" defaultValue={this.state.data.detail} readOnly/>          
                                        </fieldset>
                                        <fieldset>
                                            <button onClick={() => {sessionStorage.setItem("id_proposta", this.state.data.id); this._cancelModalClick(); sessionStorage.setItem("title", this.state.data.title);}} className="smallbutton" type="button">Cancelar candidatura</button>
                                            { this.state.showCancelModal ?
                                                    <CancelModal/> 
                                                :
                                                    null
                                            }
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }


        else if(this.state.auth && this.state.loading === false && !this.state.data.isCandidate) {
            return (
                <div className="content">
                    {/*-----------------------barra superior da p??gina 'content'-------------------*/}
                    <div className="Post">
                        <div className="Post-body">
                            <div className="Post-inner">
                            <div className="PostHeaderIcon-wrapper"> 
                                <table style={{width: '100%', height: '20px', borderCollapse: 'collapse'}}>
                                    <tbody>
                                        <tr>
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> A minha candidatura</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/dashboard' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <div className="errorMsg">N??o ?? candidato a nenhuma proposta!</div>
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

export default ViewApplication;