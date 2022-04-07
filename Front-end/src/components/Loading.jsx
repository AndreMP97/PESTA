import React from 'react';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

function Loading() {
    const override = css`
        display: block;
        margin-left: auto;
        margin-right: auto;
    `;
    
    return (
        <div className="content">
                {/*-----------------------barra superior da página 'content'-------------------*/}
                <div className="Post">
                    <div className="Post-body">
                        <div className="Post-inner">
                            <div className="PostHeaderIcon-wrapper" /> 
                            <div className="PostContent"> <br />
                            {/*----------------------------------------------------------------------------*/}
                            <ClipLoader color={"#186C8B"} css={override} size={150} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Loading; 