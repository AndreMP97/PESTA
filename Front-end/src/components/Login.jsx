import React, { Component } from 'react';
import '../css/Form.css';
import '../css/Table.css';
import seta from '../uploads/SETA.png';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loading from "./Loading";

class Login_proto extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: false, 
            email: '',
            password: '',
            type: '',
            message: '',
            data: []
        };
        this.filteremail = this.filteremail.bind(this);
        this.loginISEPDocentes = this.loginISEPDocentes.bind(this);
        this.loginISEPAlunos = this.loginISEPAlunos.bind(this);
        this.loginEmpresas = this.loginEmpresas.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    filteremail() {
        const email = this.state.email;
        const username = email.split("@");
        if(username[1] === "isep.ipp.pt") {
            if(username[0].length === 3) {
                localStorage.setItem("username", username[0]); 
                sessionStorage.setItem("logintype", "docentes");
                //console.log("debug", this.state.email, this.state.password, sessionStorage.getItem("username"));
            }
            else if(username[0].length === 7) {
                localStorage.setItem("username", username[0]);
                sessionStorage.setItem("logintype", "alunos");
            }
        }
        else if(username[1] !== "isep.ipp.pt") {
            localStorage.setItem("username", username[0]);
            sessionStorage.setItem("logintype", "empresas");
        }
    }

    async loginISEPDocentes() {
        // Sending the form request
        const login = await axios.post(window.website.concat("loginisepdocentes.php"),{
            email: this.state.email,
            password: this.state.password,    
            username: localStorage.getItem("username")
        });

        return login.data;
    }

    async loginISEPAlunos() {
        // Sending the form request
        const login = await axios.post(window.website.concat("loginisepalunos.php"),{
            email: this.state.email,
            password: this.state.password,    
            username: localStorage.getItem("username")
        });

        //console.log("debug", login);

        return login.data;
    }

    async loginEmpresas() {
        // Sending the form request
        const login = await axios.post(window.website.concat("loginempresas.php"),{
            email: this.state.email,
            password: this.state.password,    
            username: localStorage.getItem("username")
        });

        //console.log("debug", login);

        return login.data;
    }

    async submitForm(event) {

        event.preventDefault();
        this.filteremail();

        if (sessionStorage.getItem("logintype") === "docentes") {
            this.setState({
                loading:true
            });
            const login = await this.loginISEPDocentes();
            if (login.success) {
                localStorage.setItem("sessionID", login.sessionID);
                sessionStorage.clear();
            }
            else {
                this.setState({
                    message: "Erro ao efetuar o login! Tente novamente"
                });
            }
            this.setState({
                loading: false
            });
        }
        
        else if (sessionStorage.getItem("logintype") === "alunos") {
            this.setState({
                loading:true
            });
            const login = await this.loginISEPAlunos();
            if (login.success) {
                localStorage.setItem("sessionID", login.sessionID);
                sessionStorage.clear();
            }
            else {
                this.setState({
                    message: "Erro ao efetuar o login! Tente novamente"
                });
            }
            this.setState({
                loading: false
            });
        }

        else if (sessionStorage.getItem("logintype") === "empresas") {
            this.setState({
                loading:true
            });
            const login = await this.loginEmpresas();
            if (login.success) {
                localStorage.setItem("sessionID", login.sessionID);
                sessionStorage.clear();
            }
            else {
                this.setState({
                    message: "Erro ao efetuar o login! Tente novamente"
                });
            }
            this.setState({
                loading: false
            });

        }

    }

    onChangeValue(e) {

        this.setState({
            [e.target.name]:e.target.value
        });
        
    }

    render() {

        let Msg = '';

        if (this.state.message) {
            Msg = <div className="errorMsg">{this.state.message} <br/> </div>;
        }
        
        if (!localStorage.getItem("sessionID") && this.state.loading === false) {
            return(
                <div className="content">
                    {/*-----------------------barra superior da página 'content'-------------------*/}
                    <div className="Post">
                        <div className="Post-body">
                            <div className="Post-inner">
                                <div className="PostHeaderIcon-wrapper"> 
                                    <table style={{width: '100%', height: '20px', borderCollapse: 'collapse'}}>
                                        <tbody>
                                            <tr>
                                                <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> LOGIN</span></td>
                                                <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                                <Link to='/' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <form id="form" onSubmit={this.submitForm} noValidate>
                                        {Msg}
                                        <fieldset>
                                            <label htmlFor="email" className="mylabel">Email: </label><p></p>
                                            <input name="email" type="email" required placeholder="email" value={this.state.email} onChange={this.onChangeValue} />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="password" className="mylabel">Password: </label><p></p>
                                            <input name="password" type="password" autoComplete="on" required placeholder="password" value={this.state.password} onChange={this.onChangeValue} />
                                        </fieldset>
                                        <fieldset>
                                            <button name="submit" type="submit" id="form-submit">LOGIN</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else if (this.state.loading === true) {
            return(
                <Loading />
            )
        }

        else {
            return(
                <Redirect to="/dashboard" />
            );
        }

    }

}

export default Login_proto;