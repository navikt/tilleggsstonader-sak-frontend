import React from 'react';

import { Oppgavefiltrering } from './Oppgavefiltrering';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { erProd } from '../../utils/miljø';

const Oppgavebenk: React.FC = () => {
    return (
        <div>
            {!erProd() && <OpprettDummyBehandling />}
            <div>
                OppgaveBenk
                <Oppgavefiltrering />
            </div>
        </div>
    );
};

export default Oppgavebenk;
