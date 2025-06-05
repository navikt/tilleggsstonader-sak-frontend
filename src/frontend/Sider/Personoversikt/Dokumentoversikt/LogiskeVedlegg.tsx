import React from 'react';

import { LogiskVedlegg } from '../../../typer/dokument';

const LogiskeVedlegg: React.FC<{ logiskeVedlegg: LogiskVedlegg[] }> = ({ logiskeVedlegg }) => {
    return logiskeVedlegg.map((logiskVedlegg, index) => (
        <div key={index}>{logiskVedlegg.tittel}</div>
    ));
};

export default LogiskeVedlegg;
