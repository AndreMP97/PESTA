import React, { Component } from 'react';
import seta from '../../uploads/SETA.png';
import { Link, Redirect} from 'react-router-dom';
import Loading from "../Loading";
import Error from "../Error";
import axios from 'axios';

class ChangeCompany extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: true,
            auth: '',
            error: false,
            data: [],
            submit: []
        };
        this.submitForm = this.submitForm.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("empresas/listardados.php"))
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

        axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
        
        const request = await axios.put(window.website.concat("empresas/alterardados.php"), {
            street:this.state.data.street,
            website:this.state.data.website,
            supervisor:this.state.data.supervisor,
            phone:this.state.data.phone
        });

        //console.log("debug",request);

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
                submit: submit
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

        if(this.state.auth && this.state.loading === false && this.state.error === false) {
            
            let Msg = "";
            
            if(this.state.submit.success){
                Msg = <div className="successMsg">{this.state.submit.message}</div>;
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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> Alterar dados da empresa</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/dashboard' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                <form id="form" onSubmit={this.submitForm}>
                                    {Msg}
                                    <fieldset>
                                        <label htmlFor="title" className="mylabel">Empresa: </label><p></p>
                                        <input name="title" type="text" value={this.state.data.company} tabIndex={1} readOnly/>
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="street" className="mylabel">Endereço: </label><p></p>
                                        <input name="street" type="text" value={this.state.data.street} onChange={this.onChangeValue} tabIndex={2} required />
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="website" className="mylabel">Website: </label><p></p>
                                        <input name="website" type="text" value={this.state.data.website} onChange={this.onChangeValue} tabIndex={3} required />
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="supervisor" className="mylabel">Representante: </label><p></p>
                                        <input name="supervisor" type="text" value={this.state.data.supervisor} onChange={this.onChangeValue} tabIndex={4} required />
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="phone" className="mylabel">Contato Telefónico: </label><p></p>
                                        <input name="phone" type="tel" value={this.state.data.phone} onChange={this.onChangeValue} tabIndex={5} required pattern="[0-9]{9}"/>
                                    </fieldset>
                                    <fieldset>
                                        <button name="submit" type="submit" id="form-submit">Alterar dados</button>
                                    </fieldset>
                                </form>
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

export default ChangeCompany;