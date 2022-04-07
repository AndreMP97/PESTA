import React, { Component } from 'react';
import Loading from "../Loading";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import StudentProjects from '../alunos/ListProjects';
import StudentInternships from '../alunos/ListInternships';
import ApprovedCompany from "../empresas/ListProposalsApproved";
import RequestedCompany from "../empresas/ListProposalsRequested";
import TeacherProjects from '../docentes/ListProjects';
import TeacherInternships from '../docentes/ListInternships';
import Error from "../Error";

class ListProposals extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = { 
            loading: true,
            error: false,
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


    render() {
        
        if (localStorage.getItem("sessionID") && this.state.loading === false && this.state.auth && this.state.error === false) {
            
            if (this.state.data.usertype === "aluno" && sessionStorage.getItem("typeProposal") === "project") {
                return(
                    <StudentProjects />
                );
            }

            else if (this.state.data.usertype === "aluno" && sessionStorage.getItem("typeProposal") === "internship") {
                return(
                    <StudentInternships />
                );
            }

            else if (this.state.data.usertype === "empresa" && sessionStorage.getItem("typeProposal") === "approved") {
                return(
                    <ApprovedCompany />
                );
            }

            else if (this.state.data.usertype === "empresa" && sessionStorage.getItem("typeProposal") === "awaiting") {
                return(
                    <RequestedCompany />
                );
            }

            else if ((this.state.data.usertype === "docente" || this.state.data.usertype === "diretor") && sessionStorage.getItem("typeProposal") === "project") {
                return(
                    <TeacherProjects />
                );
            }

            else if ((this.state.data.usertype === "docente" || this.state.data.usertype === "diretor") && sessionStorage.getItem("typeProposal") === "internship") {
                return(
                    <TeacherInternships />
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

export default ListProposals;