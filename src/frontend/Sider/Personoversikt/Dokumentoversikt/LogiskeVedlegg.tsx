import React from 'react';

import { LogiskVedlegg } from '../../../typer/dokument';

const LogiskeVedlegg: React.FC<{ logiskeVedlegg: LogiskVedlegg[] }> = ({ logiskeVedlegg }) => {
    return logiskeVedlegg.map((logiskVedlegg) => (
        <div key={`${logiskVedlegg.tittel}-${logiskVedlegg.logiskVedleggId}`}>
            {logiskVedlegg.tittel}
        </div>
    ));
};

export default LogiskeVedlegg;
