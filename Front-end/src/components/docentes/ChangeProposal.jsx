import React, { Component } from 'react';
import seta from '../../uploads/SETA.png';
import svg from '../../uploads/form.svg';
import { Link, Redirect} from 'react-router-dom';
import Loading from "../Loading";
import axios from 'axios';
import Error from "../Error";

class ChangeProposal extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: true,
            auth: '',
            error: false,
            redirect: false, 
            data: []
        };
        this.submitForm = this.submitForm.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("docentes/verprojeto.php"),{
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

    async change() {

        // Sending the user registration request
        axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
        const request = await axios.put(window.website.concat("docentes/alterarprojeto.php"), {
            id:this.state.data.id,
            title:this.state.data.title,
            detail:this.state.data.detail,
            requirements:this.state.data.requirements
        });

        //console.log("request", request);
        
        return request.data;

    }

    async submitForm(event) {

        event.preventDefault();
        
        this.setState({
            loading:true
        });

        const submit = await this.change();
        
        if(submit.success){
            this.setState({
                loading: false,
                auth: submit.auth,
                redirect: true
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
            data:{
                ...this.state.data,
                [e.target.name]:e.target.value
            }
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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> Alterar Proposta</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/verproposta' onClick={ () => {sessionStorage.removeItem("proposal");}} style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                <form id="form" onSubmit={this.submitForm}>
                                    <fieldset>
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
                                        <input name="title" type="text" value={this.state.data.title} onChange={this.onChangeValue} tabIndex={1} required/>
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="detail" className="mylabel">Breve descrição do trabalho: </label><p></p>
                                        <textarea name="detail" value={this.state.data.detail} onChange={this.onChangeValue} tabIndex={2} required />          
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="requirements" className="mylabel">Recursos DEE: </label><p></p>
                                        <textarea name="requirements" value={this.state.data.requirements} onChange={this.onChangeValue} tabIndex={3} required />          
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="submit" id="form-submit">Alterar</button>
                                    </fieldset>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else if(this.state.auth && this.state.loading === false && this.state.error === false && this.state.redirect === true) {
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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> Alterar Proposta</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/verproposta' onClick={ () => {sessionStorage.removeItem("proposal");}} style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                <img src={svg} alt="" className="center"/>
                                <h1 style={{textAlign: 'center'}}>Proposta alterada com sucesso!</h1>
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

export default ChangeProposal;