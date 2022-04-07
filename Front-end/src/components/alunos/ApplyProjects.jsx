import React, { Component } from 'react';
import seta from '../../uploads/SETA.png';
import svg from '../../uploads/form.svg';
import { Link, Redirect} from 'react-router-dom';
import Loading from "../Loading";
import Error from "../Error";
import axios from 'axios';

class ApplyInternships extends Component {
    constructor() {
        super();
        this.state = { loading: true, 
            auth: '',
            data: [],
            redirect: false,
            error: false,
            isCandidate: false,
            message: ''
        };
        this.submitForm = this.submitForm.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("alunos/verprojeto.php"),{
                params: {
                    id:sessionStorage.getItem("id_proposta"),
                }
            })
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

    async send() {

        axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
        
        const request = await axios.post(window.website.concat("alunos/candidatar.php"), {
            id:sessionStorage.getItem("id_proposta"),
            message:this.state.message
        });

        //console.log("debug", request.data);

        return request.data;

    }

    async submitForm(event) {
        
        event.preventDefault();
        
        this.setState({
            loading:true
        });
        
        const application = await this.send();
        
        if(application.success){
            
            if (application.auth) {
                this.setState({
                    loading: false,
                    auth: application.auth,
                    redirect: true
                })
            }

            else {
                this.setState({
                    loading: false,
                    auth: application.auth
                })
            }
            
        }

        else if (!application.success && application.isCandidate){
            this.setState({
                loading: false,
                isCandidate: true
            })
        }

        else {
            this.setState({
                loading: false,
                error: true
            })
        }

    }

    onChangeValue(e) {
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    render() {

        if(this.state.auth && this.state.loading === false && !this.state.redirect && this.state.error === false) {

            let Msg = '';

            if (this.state.isCandidate === true) {
                Msg = <div className="errorMsg">Já é candidato a outra proposta! Cancele a sua candidatura anterior de modo a efetuar uma nova! <br /></div>;
            }

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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> Ver Projeto</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/consultarpropostas' onClick={ () => {sessionStorage.removeItem("id_proposta");} }style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                <form id="form" onSubmit={this.submitForm}>
                                <fieldset>
                                    {Msg}
                                    <label htmlFor="course" className="mylabel">Curso: </label><p></p>
                                        <select name="course" id="course" tabIndex={0} defaultValue={this.state.data.course} disabled>
                                            <option value="LEEC">LICENCIATURA EM ENGENHARIA ELETROTÉCNICA E DE COMPUTADORES</option>
                                            <option value="LEESEE">LICENCIATURA EM ENGENHARIA ELETROTÉCNICA - SISTEMAS ELÉCTRICOS DE ENERGIA</option>
                                            <option value="LETI">LICENCIATURA EM ENGENHARIA DE TELECOMUNICAÇÕES E INFORMÁTICA</option>
                                            <option value="MEEC">MESTRADO EM ENGENHARIA ELETROTÉCNICA E DE COMPUTADORES</option>
                                            <option value="MEESEE">MESTRADO EM ENGENHARIA ELETROTÉCNICA - SISTEMAS ELÉTRICOS DE ENERGIA</option>
                                        </select>
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="title" className="mylabel">Título: </label><p></p>
                                        <input name="title" defaultValue={this.state.data.title} type="text" readOnly/>
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="detail" className="mylabel">Breve descrição do trabalho: </label><p></p>
                                        <textarea name="detail" defaultValue={this.state.data.detail} readOnly/>          
                                    </fieldset>
                                    <hr></hr>
                                    <fieldset>
                                        <label htmlFor="message" className="mylabel">Mensagem: </label><p></p>
                                        <textarea name="message" placeholder="Mensagem ao proponente (pode deixar em branco)" value={this.state.message} onChange={this.onChangeValue} />
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="submit" id="form-submit">Candidatar-se</button>
                                    </fieldset>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else if(this.state.redirect === true && this.state.isCandidate === false) {
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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> CANDIDATAR-SE</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/consultarpropostas' onClick={ () => {sessionStorage.removeItem("id_proposta");} }style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                <img src={svg} alt="" className="center"/>
                                <h1 style={{textAlign: 'center'}}>Candidatou-se ao projeto "{this.state.data.title}"!</h1>
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

export default ApplyInternships;