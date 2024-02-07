import React from 'react';

import { Select } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { OppgaveRequest } from '../typer/oppgave';

interface Props {
    oppgaveRequest: OppgaveRequest;
    settOppgaveRequest: React.Dispatch<React.SetStateAction<OppgaveRequest>>;
}
const utledSaksbehandlerTekst = ({ tildeltRessurs, tilordnetRessurs }: OppgaveRequest) => {
    if (tildeltRessurs === undefined && tilordnetRessurs === undefined) {
        return 'Alle';
    } else if (tilordnetRessurs) {
        return tilordnetRessurs;
    } else if (tildeltRessurs) {
        return 'Fordelte';
    } else {
        return 'Ufordelte';
    }
};

const SaksbehandlerVelger: React.FC<Props> = ({ oppgaveRequest, settOppgaveRequest }) => {
    const { saksbehandler } = useApp();

    const saksbehandlerTekst = utledSaksbehandlerTekst(oppgaveRequest);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value;
        if (val === 'Alle') {
            settOppgaveRequest((prevState: OppgaveRequest) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                return rest;
            });
        } else if (val === 'Fordelte' || val === 'Ufordelte') {
            settOppgaveRequest((prevState: OppgaveRequest) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                return {
                    ...rest,
                    tildeltRessurs: val === 'Fordelte',
                };
            });
        } else {
            settOppgaveRequest((prevState: OppgaveRequest) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { tildeltRessurs, tilordnetRessurs, ...rest } = prevState;
                return {
                    ...rest,
                    tilordnetRessurs: val,
                };
            });
        }
    };

    return (
        <Select value={saksbehandlerTekst} label="Saksbehandler" onChange={onChange} size="small">
            <option value="Alle">Alle</option>
            <option value="Fordelte">Fordelte</option>
            <option value="Ufordelte">Ufordelte</option>
            {saksbehandler && <option value={saksbehandler.navIdent}>{saksbehandler.name}</option>}
        </Select>
    );
};

export default SaksbehandlerVelger;
