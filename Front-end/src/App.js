import React from 'react';
import { BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import './css/App.css';
import Header from "./components/Header";
import Nav from "./components/Nav";
import Sidebar from "./components/controllers/Sidebar";
import Form from "./components/controllers/Form";
import Login from "./components/Login";
import Logout from "./components/Logout";
import SignUp from "./components/SignUp";
import PageNotFound from "./components/404";
import Home from "./components/controllers/Home";
import Dashboard from "./components/controllers/Dashboard";
import ProtectedRoute from './components/ProtectedRoute'
import ListProposals from "./components/controllers/ListProposals";
import ListProposalsDirector from "./components/controllers/ListProposalsDirector";
import ViewProposal from "./components/controllers/ViewProposal";
import ViewProposalDirector from "./components/controllers/ViewProposalDirector";
import ChangeProposal from "./components/controllers/ChangeProposal";
import ViewCandidates from "./components/controllers/ViewCandidates";
import ViewCandidatesDirector from "./components/controllers/ViewCandidatesDirector";
import ChangeCompany from "./components/empresas/ChangeCompany";
import Feedback from "./components/controllers/AskFeedback";
import ListFeedback from "./components/controllers/ListFeedback";
import GiveFeedback from "./components/controllers/GiveFeedback";
import AssignSupervisor from "./components/controllers/AssignSupervisor";
import Application from './components/controllers/Application';
import ViewApplication from "./components/alunos/ViewApplication";
import ViewMessage from "./components/controllers/ViewMessage";

function App() {

  return (
    <div className="Main">
      <div className="Sheet">
        <div className="Sheet-body">
          <Header />
          <p></p>
            <Router>
              <Route render={withRouter(({ location }) => (
              <div className="nav">
                <Nav />
                <div className="contentLayout">
                <TransitionGroup>
                  <CSSTransition key={location.pathname} classNames="fade" timeout={300} exit = {false}>
                    <Sidebar /> 
                  </CSSTransition>
                </TransitionGroup>
                <TransitionGroup>
                  <CSSTransition key={location.pathname} classNames="fade" timeout={300} exit = {false}>
                      <>
                        <Switch>
                          <Route exact path="/" component={Home}/>
                          <Route exact path="/login" component={Login}/>
                          <ProtectedRoute exact path="/logout" component={Logout}/>
                          <Route exact path="/registoempresas" component={SignUp}/>
                          <ProtectedRoute exact path="/submeterproposta" component={Form}/>
                          <ProtectedRoute exact path="/dashboard" component={Dashboard}/>
                          <ProtectedRoute exact path="/consultarpropostas" component={ListProposals}/>
                          <ProtectedRoute exact path="/consultarcurso" component={ListProposalsDirector}/>
                          <ProtectedRoute exact path="/verproposta" component={ViewProposal}/>
                          <ProtectedRoute exact path="/verpropostacurso" component={ViewProposalDirector}/>
                          <ProtectedRoute exact path="/alterarproposta" component={ChangeProposal}/>
                          <ProtectedRoute exact path="/vercandidatura" component={ViewApplication}/>
                          <ProtectedRoute exact path="/vercandidatos" component={ViewCandidates}/>
                          <ProtectedRoute exact path="/vercandidatoscurso" component={ViewCandidatesDirector}/>
                          <ProtectedRoute exact path="/alterardados" component={ChangeCompany}/>
                          <ProtectedRoute exact path="/pedirparecer" component={Feedback}/>
                          <ProtectedRoute exact path="/verpareceres" component={ListFeedback}/>
                          <ProtectedRoute exact path="/darparecer" component={GiveFeedback}/>
                          <ProtectedRoute exact path="/atribuirorientador" component={AssignSupervisor}/>
                          <ProtectedRoute exact path="/candidatar" component={Application}/>
                          <ProtectedRoute exact path="/vermensagem" component={ViewMessage}/>
                          <Route path="*" component={PageNotFound}/>
                        </Switch>
                      </>
                  </CSSTransition>
                </TransitionGroup>
                </div>
              </div>
              ))}
            />
            </Router>
          </div>
        </div>
        <div className="cleared"></div>
        <p className="page-footer">&nbsp;</p>
      </div>
  );
}

export default App;
