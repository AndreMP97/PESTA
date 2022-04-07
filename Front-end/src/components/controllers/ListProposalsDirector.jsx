import React, { Component } from 'react';
import Loading from "../Loading";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import ListProjects from '../diretor/ListProjects';
import ListInternships from '../diretor/ListInternships';
import ListRequests from '../diretor/ListRequests';
import Error from "../Error";

class ListProposalsDirector extends Component {
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
            
            if (this.state.data.usertype === "diretor" && sessionStorage.getItem("typeProposal") === "project") {
                return(
                    <ListProjects />
                );
            }

            else if (this.state.data.usertype === "diretor" && sessionStorage.getItem("typeProposal") === "internship") {
                return(
                    <ListInternships />
                );
            }

            else if (this.state.data.usertype === "diretor" && (sessionStorage.getItem("typeProposal") === "request" || sessionStorage.getItem("typeProposal") === "feedback")) {
                return(
                    <ListRequests />
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

export default ListProposalsDirector;