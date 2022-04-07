import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Loading from "../Loading";
import MessageTeacher from "../docentes/ViewMessage";
import MessageCompany from "../empresas/ViewMessage";
import axios from 'axios';

class ViewMessage extends Component {
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
    
        if (localStorage.getItem("sessionID") && this.state.loading === false && this.state.auth) {

            if (this.state.data.usertype === "docente" || this.state.data.usertype === "diretor") {
                return(
                    <MessageTeacher />
                );
            }

            else if (this.state.data.usertype === "empresa") {
                return(
                    <MessageCompany />
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

export default ViewMessage;