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

class ModalArchive extends Component {
    _isMounted = false;

    constructor () {
      super();
      this.state = {
          loading: false,
          success: '',
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
        if(this._isMounted && sessionStorage.getItem("ArchiveModal") === "true") {
            this.handleOpenModal();
            sessionStorage.removeItem("ArchiveModal");
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

    async archive() {

        this.setState({ loading: true });

        axios.defaults.headers.common['Authorization'] = localStorage.getItem("sessionID");
        const archive = await axios.put(window.website.concat("empresas/arquivar.php"), {
            id:sessionStorage.getItem("id_proposta")
        });

        if(archive.data.success && archive.data.auth){
            this.setState({
                loading: false,
                success: true
            });
        }

        else if(archive.data.success && !archive.data.auth){
            this.setState({
                loading: false,
                success: false
            });
        }

        else if(!archive.data.success){
            this.setState({
                loading: false,
                success: false
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
                        <div className="header"> Ocultar Estágio </div>
                        <div className="content">
                            <div className="msg">
                                Quer ocultar o estágio "{sessionStorage.getItem("title")}"?
                            </div>
                            <br />
                        </div>
                        <div className="actions">
                            <button
                                className="successButton"
                                onClick={() => {
                                    this.handleCloseModal();
                                    this.archive();
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
                        <div className="header"> Ocultar Estágio </div>
                        <div className="content">

                            { this.state.loading ?
                                    <Loading />
                                :
                                    null
                            }
                            { this.state.success === true ?
                                <div className="successMsg">
                                    O Estágio "{sessionStorage.getItem("title")}" foi ocultado!
                                </div>
                                :
                                null
                            }
                            { this.state.success === false ?
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

export default ModalArchive;