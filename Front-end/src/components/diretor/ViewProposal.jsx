import React from 'react'
import Projects from "./ViewProjects";
import Internships from "./ViewInternships";
import Requested from "./ViewRequestedInternships";
import Feedback from "./ViewFeedbackInternships";
import { Redirect } from 'react-router-dom';

function ViewProposal() {

    if(sessionStorage.getItem("typeProposal") === "project") {
        return ( 
            <Projects />
        )
    }

    else if(sessionStorage.getItem("typeProposal") === "internship") {
        return (
            <Internships />
        )
    }

    else if(sessionStorage.getItem("typeProposal") === "request") {
        return (
            <Requested />
        )
    }

    else if(sessionStorage.getItem("typeProposal") === "feedback") {
        return (
            <Feedback />
        )
    }

    else if(!sessionStorage.getItem("typeProposal")) {
        return(
            <Redirect to="/dashboard" />
        );
    }

}

export default ViewProposal;