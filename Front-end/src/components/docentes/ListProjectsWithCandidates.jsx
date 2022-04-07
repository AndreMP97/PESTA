import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loading from "../Loading_content";
import ArchiveModal from './ModalArchive';
import Error from "../Error_content";
import ReactPaginate from 'react-paginate';

class ListProjectsWithCandidates extends Component {
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
            showArchiveModal: false
        };
        this._archiveClick = this._archiveClick.bind(this);
        sessionStorage.removeItem("currentPage");
    }

    async componentDidMount() {
        
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("docentes/projetoscandidatos.php"))
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

    _archiveClick() {
        sessionStorage.setItem("ArchiveModal", true);
        this.setState({
            showArchiveModal: true,
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
        const course = Object.values(this.state.data.course);
        const id = Object.values(this.state.data.id_proposta);
        const title = Object.values(this.state.data.title);
        const date = Object.values(this.state.data.date);
        const count = Object.values(this.state.data.count);
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
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Curso </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Título </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Data da 1ª candidatura </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Candidatos </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Detalhes </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Estado </span> </th>
            </tr>
        );
        
        for (var i = min; i < max; i++) {
            const pid = id[i];
            const ptitle = title[i];
            body.push(
                <tr key={i}>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{course[i].toUpperCase()}</span>
                    </td>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{title[i]}</span>
                    </td>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{date[i]}</span>
                    </td>
                    <td> 
                        <Link to='/vercandidatos' onClick={ () => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("title", ptitle); sessionStorage.setItem("currentPage", this.state.currentPage);}}>
                            <button className="smallbutton" type="submit">{count[i]}</button>
                        </Link>
                    </td>
                    <td>
                        <Link to='/verproposta' onClick={() => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("currentPage", this.state.currentPage);}}> 
                            <button className="smallbutton" type="submit" id="form-submit">Ver</button>
                        </Link>
                    </td>
                    <td>  
                        <button onClick={() => {sessionStorage.setItem("id_proposta", pid); this._archiveClick(); sessionStorage.setItem("title", ptitle); sessionStorage.setItem("currentPage", this.state.currentPage);}} className="smallbutton" type="submit">Ocultar </button> 
                        {
                            this.state.showArchiveModal ?
                                <ArchiveModal />
                            :
                                null
                        } 
                    </td>
                </tr>
                );
        }

        if(body.length > 0) {
            table.push(<thead key = {0}>{head}</thead>, <tbody key = {1}>{body}</tbody>);
        }

        else {
            table.push(<tbody key = {0}><tr><td className="errorMsg">Sem projetos por apresentar!</td></tr></tbody>);
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

export default ListProjectsWithCandidates;