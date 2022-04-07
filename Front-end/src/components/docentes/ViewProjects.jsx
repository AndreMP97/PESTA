import React, { Component } from 'react';
import seta from '../../uploads/SETA.png';
import { Link, Redirect} from 'react-router-dom';
import Loading from "../Loading";
import axios from 'axios';
import Error from "../Error";

class ViewProjects extends Component {
    constructor() {
        super();
        this.state = { 
            loading: true,
            auth: '', 
            data: [],
            error: false
        };
        this.buttons = this.buttons.bind(this);
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

    buttons() {

        if(this.state.data.assigned !== null || this.state.data.concluded === "1") {
            return(null);
        }

        else {
            return(
                <div>
                    <fieldset>
                        <Link to='/alterarproposta'onClick={ () => {sessionStorage.setItem("proposal", JSON.stringify(this.state.data));}} >
                            <button className="submit" type="submit" id="form-submit">Alterar Proposta</button>
                        </Link>
                    </fieldset>
                </div> 
            );
        }

    }

    render() {

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
                                            <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> Ver Projeto</span></td>
                                            <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                            <Link to='/consultarpropostas' onClick={ () => {sessionStorage.removeItem("id_proposta");} } style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                <form id="form">
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
                                        <input name="title" defaultValue={this.state.data.title} type="text" readOnly/>
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="detail" className="mylabel">Breve descrição do trabalho: </label><p></p>
                                        <textarea name="detail" defaultValue={this.state.data.detail} readOnly/>          
                                    </fieldset>
                                    <fieldset>
                                        <label htmlFor="detail" className="mylabel">Recursos DEE: </label><p></p>
                                        <textarea name="detail" defaultValue={this.state.data.requirements} readOnly/>          
                                    </fieldset>
                                    {this.buttons()}
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

export default ViewProjects;