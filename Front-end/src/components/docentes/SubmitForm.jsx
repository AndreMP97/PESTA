import React, { Component } from 'react';
import seta from '../../uploads/SETA.png';
import svg from '../../uploads/form.svg';
import { Link, Redirect} from 'react-router-dom';
import Loading from "../Loading";
import Error from "../Error";
import axios from 'axios';

class SubmitForm extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: false,
            auth: 1,
            error: false,
            redirect: false,
            data: [],
            title:'',
            detail:'',
            requirements:'',
            course:''
        };
        this.send = this.send.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async send() {

        axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");

        const request = await axios.post(window.website.concat("docentes/proporprojeto.php"),{
            title:this.state.title,
            detail:this.state.detail,
            requirements:this.state.requirements,
            course:this.state.course
        });

        //console.log("debug",request);

        return request.data;

    }

    async submitForm(event) {

        event.preventDefault();
        
        this.setState({
            loading:true
        });

        const submit = await this.send();
        
        if(submit.success && submit.auth){
            this.setState({
                loading: false,
                auth: submit.auth,
                redirect: true
            })
        }

        else if(submit.success && !submit.auth){
            this.setState({
                loading: false,
                auth: submit.auth
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

        if(this.state.auth && this.state.loading === false && this.state.error === false && this.state.redirect === false) {
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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> PROPOR PROJETO</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/dashboard' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <form id="form" onSubmit={this.submitForm}>
                                    <fieldset>
                                            <label htmlFor="course" className="mylabel">Curso: </label><p></p>
                                            <select name="course" id="course" tabIndex={0} value={this.state.course} onChange={this.onChangeValue} required>
                                                <option hidden disabled value=""> -- Selecione um curso -- </option>
                                                <option value="LEEC">LICENCIATURA EM ENGENHARIA ELETROTÉCNICA E DE COMPUTADORES</option>
                                                <option value="LEESEE">LICENCIATURA EM ENGENHARIA ELETROTÉCNICA - SISTEMAS ELÉCTRICOS DE ENERGIA</option>
                                                <option value="LETI">LICENCIATURA EM ENGENHARIA DE TELECOMUNICAÇÕES E INFORMÁTICA</option>
                                                <option value="MEEC">MESTRADO EM ENGENHARIA ELETROTÉCNICA E DE COMPUTADORES</option>
                                                <option value="MEESEE">MESTRADO EM ENGENHARIA ELETROTÉCNICA - SISTEMAS ELÉTRICOS DE ENERGIA</option>
                                            </select>
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="title" className="mylabel">Título: </label><p></p>
                                            <input name="title" placeholder="Título" type="text" value={this.state.title} onChange={this.onChangeValue} tabIndex={1} required  />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="detail" className="mylabel">Breve descrição do trabalho: </label><p></p>
                                            <textarea name="detail" placeholder="Breve descrição do trabalho" value={this.state.detail} onChange={this.onChangeValue} tabIndex={2} required />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="requirements" className="mylabel">Recursos DEE: </label><p></p>
                                            <textarea name="requirements" placeholder="Recursos DEE" value={this.state.requirements} onChange={this.onChangeValue} tabIndex={3} required />
                                        </fieldset>
                                        <fieldset>
                                            <button name="submit" type="submit" id="form-submit">Propor</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else if(this.state.auth && this.state.redirect === true) {
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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> PROPOR PROJETO</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/dashboard' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                <img src={svg} alt="" className="center"/>
                                <h1 style={{textAlign: 'center'}}>O projeto "{this.state.title}" foi proposto com sucesso!</h1>
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

export default SubmitForm;