import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import seta from '../../uploads/SETA.png';
import { Link, Redirect } from 'react-router-dom';
import Loading from "../Loading";
import axios from 'axios';
import CancelModal from './CancelModal';
import Error from "../Error";
import ReactPaginate from 'react-paginate';

class ListInternships extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: true, 
            auth: '',
            data: [],
            error: false,
            showCancelModal: false,
            offset: 0,
            perPage: 10,
            currentPage: sessionStorage.getItem("currentPage") || 0,
            pageCount: 0
        };
        this._cancelModalClick = this._cancelModalClick.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("alunos/estagios.php"))
                .then(request => {
                    if (request.data.success && this._isMounted) {
                        this.setState({ 
                            loading: false, 
                            auth: request.data.auth,
                            data: request.data,
                            pageCount: Math.ceil(request.data.title_empresas.length / this.state.perPage)
                        });
                    }
                    else if (!request.data.success && this._isMounted) {
                        this.setState({ 
                            loading: false, 
                            error: true
                        });
                    }
                    //console.log("debug", request.data, this.state.auth);
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
            showCancelModal: true,
        });  
    }

    populateProposals() {
        const title = Object.values(this.state.data.title_empresas);
        const id = Object.values(this.state.data.id_proposta_empresas);
        const proponent = Object.values(this.state.data.proponent_empresas);
        var entries = [];

        for (var i = 0; i < title.length; i++) {
            const pid = id[i];
            const ptitle = title[i];
            if (pid === this.state.data.isCandidate) {
                entries.unshift(
                    <tr key={i}>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}><b>{title[i]}</b></span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}><b>{proponent[i].toUpperCase()}</b></span>
                        </td>
                        <td>
                            <Link to='/verproposta' onClick={() => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("typeProposal", "internship");}}>
                                <button className="smallbutton" type="submit" id="form-submit">Ver</button>
                            </Link>
                        </td>
                        <td>
                            <button onClick={() => {sessionStorage.setItem("id_proposta", pid); this._cancelModalClick(); sessionStorage.setItem("title", ptitle);}} className="smallbutton" type="submit">Cancelar </button>
                            {this.state.showCancelModal ?
                                    <CancelModal/> 
                                :
                                    null
                            }
                        </td>
                    </tr>
                    );
            }
            else {
                entries.push(
                    <tr key={i}>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{title[i]}</span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{proponent[i].toUpperCase()}</span>
                        </td>
                        <td>
                            <Link to='/verproposta' onClick={() => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("typeProposal", "internship");}}>
                                <button className="smallbutton" type="submit" id="form-submit">Ver</button>
                            </Link>
                        </td>
                        <td>
                            <Link to='/candidatar' onClick={() => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("typeProposal", "internship");}}>
                                <button className="smallbutton" type="submit" id="form-submit">Candidatar</button>
                            </Link>
                        </td>
                    </tr>
                );
            }
        }

        return(<tbody>{entries}</tbody>);
    }

    render() {
    
        if (this.state.auth && this.state.loading === false) {
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
                                                <td style={{width: '80%'}} valign="middle"><span className="PostHeader"><img src={seta} alt=""/> PROPOSTAS DE ESTÁGIO</span></td>
                                                <td style={{width: '20%', borderLeft: '3px solid #FFFFFF'}} valign="middle" align="center"><span className="PostHeader">
                                                <Link to='/dashboard' style={{textDecoration: 'none', color: '#FFFFFF'}}><strong><span style={{fontSize: 'small', fontFamily: 'verdana, geneva'}}>&lt; voltar</span></strong></Link></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="PostContent"> <br />
                                {/*----------------------------------------------------------------------------*/}
                                    <table className="mytable">
                                        <thead>
                                            <tr>
                                                <th>Título </th>
                                                <th>Empresa </th>
                                                <th>Detalhes </th>
                                                <th>Candidatura </th>
                                            </tr>
                                        </thead>
                                        {this.populateProposals()}
                                    </table>
                                </div>
                                <ReactPaginate
                                    previousLabel={"Anterior"}
                                    nextLabel={"Seguinte"}
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    pageCount={this.state.pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={this.handlePageClick}
                                    initialPage={this.state.currentPage}
                                    containerClassName={"pagination"}
                                    activeClassName={"active"}
                                />
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

export default ListInternships;