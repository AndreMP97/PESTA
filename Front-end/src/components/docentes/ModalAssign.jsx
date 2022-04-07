import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Popup.css';
import axios from 'axios';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import Loading from "../Loading_content";

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
};

class ModalAssign extends Component {
    _isMounted = false;

    constructor () {
      super();
      this.state = {
          loading: false,
          error: '',
          success: '',
          message: '',
          showModal: false,
          showModal2: false
      };
      this.handleOpenModal = this.handleOpenModal.bind(this);
      this.handleOpenModal2 = this.handleOpenModal2.bind(this);
      this.handleCloseModal = this.handleCloseModal.bind(this);
      this.handleCloseModal2 = this.handleCloseModal2.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted && sessionStorage.getItem("AssignModal") === "true") {
            this.handleOpenModal();
            sessionStorage.removeItem("AssignModal");
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    handleOpenModal () {
      this.setState({ showModal: true });
    }
    
    handleOpenModal2 () {
      this.setState({ showModal2: true });
    }
    
    handleCloseModal () {
      this.setState({ showModal: false });
    }
    
    handleCloseModal2 () {
      this.setState({ showModal2: false });
    }

    refreshPage() {
        window.location.reload();
    }

    async assign() {

        this.setState({ loading: true });

        axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
        const assign = await axios.put(window.website.concat("docentes/atribuir.php"), {
            id:sessionStorage.getItem("id_proposta"),
            student:sessionStorage.getItem("student"),
            title:sessionStorage.getItem("title"),
        });

        if(assign.data.success && assign.data.auth){
            this.setState({
                loading: false,
                error:false,
                success: true
            });
        }

        else if(assign.data.success && !assign.data.auth){
            this.setState({
                loading: false,
                error: false,
                success: false
            });
        }

        else if(!assign.data.success){
            this.setState({
                loading: false,
                error: true,
                success: false,
                message: assign.data.message
            });
        }

    }
    
    render () {
        return (
            <div>
                <ReactModal 
                    isOpen={this.state.showModal}
                    style={customStyles}
                    ariaHideApp={false}
                >
                    <div className="modal">
                        <div className="header"> Atribuir Projeto </div>
                        <div className="content">
                            <div className="msg">
                                Atribuir o projeto "{sessionStorage.getItem("title")}" ao aluno {sessionStorage.getItem("student")}?
                            </div>
                            <br />
                        </div>
                        <div className="actions">
                            <button
                                className="successButton"
                                onClick={() => {
                                    this.handleCloseModal();
                                    this.assign();
                                    this.handleOpenModal2();
                                }}
                            >
                                Sim
                            </button>
                            <button
                                className="errorButton"
                                onClick={() => {
                                    this.handleCloseModal();
                                    this.refreshPage();
                                    sessionStorage.removeItem("student");
                                }}
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </ReactModal>
                <ReactModal 
                    isOpen={this.state.showModal2}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Msg Modal"
                >
                    <div className="modal">
                        <div className="header"> Atribuir Projeto </div>
                        <div className="content">

                            { this.state.loading ?
                                    <Loading />
                                :
                                    null
                            }

                            { (this.state.success === true && this.state.error === false) ?
                                <div className="successMsg">
                                    O aluno "{sessionStorage.getItem("student")}" foi atribuído ao projeto "{sessionStorage.getItem("title")}"!
                                </div>
                                :
                                null
                            }

                            { (this.state.success === false && this.state.error === true) ?
                                <div className="errorMsg">
                                    ERRO: {this.state.message}
                                </div>
                                :
                                null
                            }

                            { (this.state.success === false && this.state.error === false) ?
                                <div className="errorMsg">
                                    ERRO: Ocorreu um erro! Tente novamente! Se o erro persistir, contate o helpdesk!
                                </div>
                                :
                                null
                            }

                        </div>
                        <div className="actions">

                        { this.state.success === true ?
                                <Link to='/consultarpropostas' 
                                onClick={() => {
                                        this.handleCloseModal2();
                                        sessionStorage.removeItem("title");
                                        sessionStorage.removeItem("id_proposta");
                                        sessionStorage.removeItem("student");
                                        sessionStorage.setItem("tabletype", "assigned");
                                }}>
                                    <button className="button" >
                                        Fechar
                                    </button>
                                </Link>
                                :
                                <Link to='/vercandidatos' 
                                onClick={() => {
                                        this.handleCloseModal2();
                                        sessionStorage.removeItem("student");
                                        this.refreshPage();
                                }}>
                                    <button className="button" >
                                        Fechar
                                    </button>
                                </Link>
                        }
  
                        </div>
                    </div>
                </ReactModal>
            </div>
      );
    }
}

export default ModalAssign;