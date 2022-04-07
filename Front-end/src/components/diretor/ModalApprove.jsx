import React, { Component } from 'react';
import '../../css/Form.css';
import '../../css/Popup.css';
import axios from 'axios';
import ReactModal from 'react-modal';
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

class ModalApprove extends Component {
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
        if(this._isMounted && sessionStorage.getItem("ApproveModal") === "true") {
            this.handleOpenModal();
            sessionStorage.removeItem("ApproveModal");
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

    async approve () {
        this.setState({ loading: true });

        axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
        const approve = await axios.put(window.website.concat("diretor/aprovarestagio.php"), {
            id:sessionStorage.getItem("id_proposta")
        });

        if(approve.data.success && approve.data.auth){
            this.setState({
                loading: false,
                error:false,
                success: true
            });
        }

        else if(approve.data.success && !approve.data.auth){
            this.setState({
                loading: false,
                error: false,
                success: false
            });
        }

        else if(!approve.data.success){
            this.setState({
                loading: false,
                error: true,
                success: false,
                message: approve.data.message
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
                        <div className="header"> Aprovar Estágio </div>
                        <div className="content">
                            <div className="msg">
                                Quer aprovar o estágio "{sessionStorage.getItem("title")}"?
                            </div>
                            <br />
                        </div>
                        <div className="actions">
                            <button
                                className="successButton"
                                onClick={() => {
                                    this.handleCloseModal();
                                    this.approve();
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
                                    sessionStorage.removeItem("title");
                                    sessionStorage.removeItem("id_proposta");
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
                        <div className="header"> Aprovar Estágio </div>
                        <div className="content">
                           
                            { this.state.loading ?
                                    <Loading />
                                :
                                    null
                            }

                            { (this.state.success === true && this.state.error === false) ?
                                <div className="successMsg">
                                    O estágio "{sessionStorage.getItem("title")}" foi aprovado!
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
                            <button
                                className="button"
                                onClick={() => {
                                    this.handleCloseModal2();
                                    this.refreshPage();
                                    sessionStorage.removeItem("title");
                                    sessionStorage.removeItem("id_proposta");
                                }}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </ReactModal>
            </div>
      );
    }
}

export default ModalApprove;