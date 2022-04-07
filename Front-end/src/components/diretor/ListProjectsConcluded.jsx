import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Table.css';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Loading from "../Loading_content";

class ListProjectsConcluded extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: true, 
            auth: '',
            data: []
        };
    }

    async componentDidMount() {
        this._isMounted = true;
        
        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
            await axios.get(window.website.concat("diretor/projetosconcluidos.php"))
                .then(request => {
                    if (request.data.success && this._isMounted) {
                        this.setState({ 
                            loading: false, 
                            auth: request.data.auth,
                            data: request.data
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

    populateProposals() {
        const id = Object.values(this.state.data.id_proposta);
        const title = Object.values(this.state.data.title);
        const proponent = Object.values(this.state.data.proponent);
        const supervisor = Object.values(this.state.data.supervisor);
        const concluded_date = Object.values(this.state.data.concluded_date);
        const student = Object.values(this.state.data.student);
        var head =  [];
        var body = [];
        var table = [];

        head.push(
            <tr key = {0}>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Título </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Proponente </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Orientador </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Aluno </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Data de conclusão </span></th>
                <th><span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#FFFFFF'}}>Detalhes </span> </th>
            </tr>
        );
        
        for (var i = 0; i < title.length; i++) {
            const pid = id[i];
            body.push(
                <tr key={i}>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{title[i]}</span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{proponent[i].toUpperCase()}</span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{supervisor[i].toUpperCase()}</span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{student[i]}</span>
                        </td>
                        <td>
                            <span style={{fontSize: 'small', fontFamily: 'verdana, geneva', color: '#124F87'}}>{concluded_date[i]}</span>
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
            table.push(<tbody key = {0}><tr><td className="errorMsg">Sem projetos por apresentar!</td></tr></tbody>);
        }

        return(<table className="mytable">{table}</table>);
    }

    render() {

        if (this.state.auth && this.state.loading === false) {
            return(
                <div>
                    {this.populateProposals()}
                </div>
            );
        }
        
        else if (this.state.loading === true) {
            return(
                <Loading />
            )
        }

        else if (!this.state.auth) {
            return(
                <Redirect to="/logout" />
            )
        }

        else {
            return(
                <Redirect to="/404" />
            );
        }

    }

}

export default ListProjectsConcluded;