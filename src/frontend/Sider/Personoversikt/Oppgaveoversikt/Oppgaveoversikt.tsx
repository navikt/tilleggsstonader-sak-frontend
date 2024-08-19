import React from 'react';

import Oppgaver from './Oppgaver';

const Oppgaveoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    return (
        <>
            <Oppgaver fagsakPersonId={fagsakPersonId} />
        </>
    );
};

export default Oppgaveoversikt;
