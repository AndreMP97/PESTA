
import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loading from "../Loading_content";
import ConcludeModal from './ModalConcludeInternship';
import Error from "../Error_content";
import ReactPaginate from 'react-paginate';

class ListInternshipsActive extends Component {
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
            showConcludeModal: false
        };
        this._concludeClick = this._concludeClick.bind(this);
        sessionStorage.removeItem("currentPage");
    }

    async componentDidMount() {
        
        this._isMounted = true;

        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("docentes/estagiosativos.php"))
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

    _concludeClick() {
        sessionStorage.setItem("ConcludeModal", true);
        this.setState({
            showConcludeModal: true,
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
        const course = Object.values(this.state.data.course);
        const title = Object.values(this.state.data.title);
        const proponent = Object.values(this.state.data.proponent);
        const date = Object.values(this.state.data.date);
        const student = Object.values(this.state.data.student);
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
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>T??tulo </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Proponente</span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Atribu??do em </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Aluno </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Detalhes </span> </th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Estado </span> </th>
            </tr>
        );
        
        for (var i = min; i < max; i++) {
            const ptitle = title[i];
            const pid = id[i];   
                body.push(
                    <tr key={i}>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{course[i]}</span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{title[i]}</span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{proponent[i]}</span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{date[i]}</span>
                        </td>
                        <td>
                            <center><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{student[i]}</span></center>
                        </td>
                        <td>
                            <Link to='/verproposta' onClick={() => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("currentPage", this.state.currentPage);}}> 
                                <button className="smallbutton" type="submit" id="form-submit">Ver</button>
                            </Link>
                        </td>
                        <td>
                            <button onClick={() => {sessionStorage.setItem("id_proposta", pid); sessionStorage.setItem("title", ptitle); sessionStorage.setItem("currentPage", this.state.currentPage); this._concludeClick();}} className="smallbutton" type="submit">Concluir</button>
                            {
                                this.state.showConcludeModal ?
                                    <ConcludeModal />
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
            table.push(<tbody key = {0}><tr><td className="errorMsg">Sem est??gios por apresentar!</td></tr></tbody>);
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

export default ListInternshipsActive;