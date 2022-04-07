import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loading from "../Loading_content";
import UnArchiveModal from './ModalUnArchive';
import Error from "../Error_content";
import ReactPaginate from 'react-paginate';

class ListProposalsArchived extends Component {
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
            showUnArchiveModal: false
        };
        this._unarchiveClick = this._unarchiveClick.bind(this);
    }

    async componentDidMount() {

        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("empresas/estagiosarquivados.php"))
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

    _unarchiveClick() {
        sessionStorage.setItem("UnArchiveModal", true);
        this.setState({
            showUnArchiveModal: true,
        }); 
    }

    populateProposals() {
        const course = Object.values(this.state.data.course);
        const id = Object.values(this.state.data.id_proposta);
        const title = Object.values(this.state.data.title);
        const archived_date = Object.values(this.state.data.date);
        var head =  [];
        var body = [];
        var table = [];

        head.push(
            <tr key = {0}>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Curso </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Título </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Ocultada em </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Detalhes </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Estado </span> </th>
            </tr>
        );
        
        for (var i = 0; i < title.length; i++) {
            const pid = id[i];
            const ptitle = title[i];
            body.push(
                <tr key={i}>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#B8C4C6'}}>{course[i]}</span>
                    </td>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#B8C4C6'}}>{title[i]}</span>
                    </td>
                    <td>
                        <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#B8C4C6'}}>{archived_date[i]}</span>
                    </td>
                    <td>
                        <Link to='/verproposta' onClick={() => {sessionStorage.setItem("id_proposta", pid);}}> 
                            <button className="invertedbutton" type="submit" id="form-submit">Ver</button>
                        </Link>
                    </td>
                    <td>
                        <button onClick={() => {sessionStorage.setItem("id_proposta", pid); this._unarchiveClick(); sessionStorage.setItem("title", ptitle);}} className="invertedbutton" type="submit">Tornar Vísivel </button>  
                            {
                                this.state.showUnArchiveModal ?
                                    <UnArchiveModal />
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
            table.push(<tbody key = {0}><tr><td className="errorMsg">Sem estágios por mostrar!</td></tr></tbody>);
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

export default ListProposalsArchived;