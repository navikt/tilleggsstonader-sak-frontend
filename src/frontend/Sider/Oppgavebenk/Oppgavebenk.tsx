import React from 'react';

import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { erProd } from '../../utils/miljø';

const Oppgavebenk: React.FC = () => {
    return <div>{!erProd() && <OpprettDummyBehandling />}</div>;
};

export default Oppgavebenk;
