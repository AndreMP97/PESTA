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
        <div>
            <ClipLoader color={"#186C8B"} css={override} size={150} />
        </div>
    );
}

export default Loading; 