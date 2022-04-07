import React, { Component } from 'react';
import DashboardDiretor from "../diretor/DashboardDiretor";
import DashboardAlunos from "../alunos/DashboardAlunos";
import DashboardEmpresas from "../empresas/DashboardEmpresas";
import DashboardDocentes from "../docentes/DashboardDocentes"
import Loading from "../Loading";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class Dashboard_proto extends Component {
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
            await axios.get(window.website.concat("verifyuser.php"))
                .then(request => {
                    if (request.data.success && this._isMounted) {
                        this.setState({ 
                            loading: false, 
                            auth: request.data.auth,
                            data: request.data.data 
                        });
                    }
                    else if (!request.data.success && this._isMounted) {
                        this.setState({ 
                            loading: false, 
                            auth: '0'
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


    render() {

        sessionStorage.clear();
        
        if (localStorage.getItem("sessionID") && this.state.loading === false && this.state.auth) {
            
            if (this.state.data.usertype === "diretor") {
                return(
                    <DashboardDiretor />
                );
            }
            
            else if (this.state.data.usertype === "aluno") {
                return(
                    <DashboardAlunos />
                );
            }

            else if (this.state.data.usertype === "empresa") {
                return(
                    <DashboardEmpresas />
                );
            }

            else if (this.state.data.usertype === "docente") {
                return(
                    <DashboardDocentes />
                );
            }

            else {
                return(
                    <Redirect to="/404" />
                );
            }
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

export default Dashboard_proto;