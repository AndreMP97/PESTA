import React, { Component } from 'react';
import Loading from "../Loading";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Give from '../docentes/GiveFeedback';
import View from '../docentes/ViewFeedback';

class GiveFeedback extends Component {
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

            if (this.state.data.usertype === "docente" && sessionStorage.getItem("feedback") === "give") {
                return(
                    <Give />
                );
            }

            else if (this.state.data.usertype === "docente" && sessionStorage.getItem("feedback") === "view") {
                return(
                    <View />
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

export default GiveFeedback;