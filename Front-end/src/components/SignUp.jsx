import React, { Component } from 'react';
import '../css/Form.css';
import '../css/Table.css';
import seta from '../uploads/SETA.png';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loading from "./Loading";
import Reaptcha from 'reaptcha';

class SignUp_proto extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: false, 
            name: '',
            street: '',
            website: '',
            supervisor: '',
            phone: '',
            email: '',
            password: '',
            verified: false,
            message: '',
            errorMessage: '',
            data: []
        };
        this.register = this.register.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async register() {
        // Sending the form request
        const register = await axios.post(window.website.concat("register.php"),{
            name: this.state.name,
            street: this.state.street,
            website: this.state.website,
            supervisor: this.state.supervisor,
            phone: this.state.phone,
            email: this.state.email,
            password: this.state.password
        });

        console.log("debug", register.data);

        return register.data;
    }

    async submitForm(event) {

        event.preventDefault();

        this.setState({
            loading:true
        });
        
        const register = await this.register();
        
        if (register.success) {
            this.setState({
                loading: false,
                message: "Registo efetuado!"
            });
        }

        else if (!register.success) {
            this.setState({
                loading: false,
                errorMessage: register.message
            });
        }

    }

    onChangeValue(e) {

        this.setState({
            [e.target.name]:e.target.value
        });
        
    }

    onVerify = recaptchaResponse => {
        if (this._isMounted) {
            this.setState({
                verified: true
            });
        }
      };

    render() {      

        let Msg = '';
        if(this.state.message) {
            Msg = <div className="successMsg">{this.state.message} <br /></div>;
        }
        else if (this.state.errorMessage) {
            Msg = <div className="errorMsg">{this.state.errorMessage} <br /></div>;
        }
        
        if (!localStorage.getItem("sessionID") && this.state.loading === false) {
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
                                                <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> Registo</span></td>
                                                <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                                <Link to='/' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <form id="form" onSubmit={this.submitForm}>
                                        {Msg}
                                        <fieldset>
                                            <label htmlFor="name" className="mylabel">Nome da Empresa: </label><p></p>
                                            <input name="name" type="text" value={this.state.name} onChange={this.onChangeValue} placeholder="Nome da Empresa" required />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="street" className="mylabel">Endereço: </label><p></p>
                                            <input name="street" type="text" value={this.state.street} onChange={this.onChangeValue} placeholder="Morada" required />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="website" className="mylabel">Website: </label><p></p>
                                            <input name="website" type="text" value={this.state.website} onChange={this.onChangeValue} placeholder="Website" required />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="supervisor" className="mylabel">Nome do Representante: </label><p></p>
                                            <input name="supervisor" type="text" value={this.state.supervisor} onChange={this.onChangeValue} placeholder="Nome do Representante" required />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="phone" className="mylabel">Contato Telefónico: </label><p></p>
                                            <input name="phone" type="tel" value={this.state.phone} onChange={this.onChangeValue} placeholder="Contato Telefónico" required />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="phone" className="mylabel">Email: </label><p></p>
                                            <input name="email" type="email" value={this.state.email} onChange={this.onChangeValue} placeholder="Email" required />
                                        </fieldset>
                                        <fieldset>
                                            <label htmlFor="password" className="mylabel">Password: </label><p></p>
                                            <input name="password" type="password" value={this.state.password} onChange={this.onChangeValue} placeholder="Password" required />
                                        </fieldset>
                                        <fieldset>
                                            <button name="submit" type="submit" id="form-submit" disabled={!this.state.verified}>Registo</button>
                                        </fieldset>
                                        {<center><Reaptcha sitekey="6Lcb0ncbAAAAACEdCyCvh31RcadO0mhRKe274CgK" onVerify={this.onVerify} /></center>}
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

export default SignUp_proto;