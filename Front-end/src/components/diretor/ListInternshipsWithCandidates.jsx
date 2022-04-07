import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loading from "../Loading_content";
import RemoveModalSupervisor from './ModalRemoveSupervisor';
import Error from "../Error_content";
import ReactPaginate from 'react-paginate';

class ListInternshipActive extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: true, 
            error: false,
            auth: '', 
            data: [],
            offset: 0,
            perPage: 10,
            currentPage: sessionStorage.getItem("currentPage") || 0,
            pageCount: 0,
            showRemoveModalSupervisor: false
        };
        this._removeSupervisorClick = this._removeSupervisorClick.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("diretor/estagioscandidatos.php"))
                .then(request => {
                    if (request.data.success && this._isMounted) {
                        this.setState({ 
                            loading: false,
                            auth: request.data.auth, 
                            data: request.data,
                            pageCount: Math.ceil(request.data.title.length / this.state.perPage)
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

    _removeSupervisorClick() {
        sessionStorage.setItem("RemoveModalSupervisor", true);
        this.setState({
            showRemoveModalSupervisor: true,
        }); 
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        });

    };

    populateProposals() {
        const id = Object.values(this.state.data.id_proposta);
        const title = Object.values(this.state.data.title);
        const proponent = Object.values(this.state.data.proponent);
        const date = Object.values(this.state.data.date);
        const candidates = Object.values(this.state.data.count);
        const supervisor = Object.values(this.state.data.supervisor);
        var head =  [];
        var body = [];
        var table = [];
        var min = this.state.offset;
        var max = (this.state.offset + this.state.perPage);

        if ((this.state.offset + this.state.perPage) > title.length) {
            max = title.length;
        }

        head.push(
            <tr key = {0}>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Título </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Proponente </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Orientador ISEP </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Data da 1ª candidatura </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Candidatos </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Detalhes </span> </th>
            </tr>
        );
        
        for (var i = min; i < max; i++) {
            const pid = id[i];
            const ptitle = title[i];
            const psupervisor = supervisor[i];
            body.push(
                <tr key={i}>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{title[i]}</span>
                    </td>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{proponent[i].toUpperCase()}</span>
                    </td>
                    <td>
                        {
                            supervisor[i] !== "NA" ?
                                <React.Fragment>
                                    <center><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{supervisor[i].toUpperCase()}</span></center>
                                    <hr></hr>
                                    <button onClick={() => {sessionStorage.setItem("id_proposta", pid); this._removeSupervisorClick(); sessionStorage.setItem("title", ptitle); sessionStorage.setItem("sigla", psupervisor);}} className="smallbutton" type="submit">Remover</button>
                                </React.Fragment>
                            :
                                <Link to='/atribuirorientador' onClick={ () => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("title", ptitle);}}>
                                    <button className="smallbutton" type="submit">Atribuir</button>
                                </Link>  
                        }
                        {
                            this.state.showRemoveModalSupervisor ?
                                <RemoveModalSupervisor />
                            :
                                null
                        }
                    </td>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{date[i]}</span>
                    </td>
                    <td> 
                        <Link to='/vercandidatoscurso' onClick={ () => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("title", ptitle);}}>
                            <button className="smallbutton" type="submit" >{candidates[i]}</button>
                        </Link>      
                    </td>
                    <td>
                        <Link to='/verpropostacurso' onClick={() => {sessionStorage.setItem("id_proposta", pid);}}> 
                            <button className="smallbutton" type="submit" id="form-submit">Ver</button>
                        </Link>
                    </td>
                </tr>
            );        
        }

        if(body.length > 0) {
            table.push(<thead key = {0}>{head}</thead>, <tbody key = {1}>{body}</tbody>);
        }

        else {
            table.push(<tbody key = {0}><tr><td className="errorMsg">Sem estágios para mostrar!</td></tr></tbody>);
        }

        return(<table className="mytable">{table}</table>);
    }

    render() {

        if (this.state.auth && this.state.loading === false && this.state.error === false) {
            return(
                <div>
                    {this.populateProposals()}
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

export default ListInternshipActive;