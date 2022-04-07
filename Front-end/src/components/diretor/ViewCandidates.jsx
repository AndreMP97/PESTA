import React from 'react'
import Projects from "./ViewCandidatesProjects";
import Internships from "./ViewCandidatesInternships";

function ViewCandidates() {

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

}

export default ViewCandidates;