import React, { useState } from 'react';

import { OpprettBehandlingForm } from './OpprettBehandlingForm';
import { OpprettBehandlingResponse } from './opprettBehandlingTypes';
import { useOpprettBehandling } from './useOpprettBehandling';
import { useApp } from '../../../../context/AppContext';
import { lagFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../../../typer/ressurs';

interface Props {
    fagsakId: string;
    hentKlagebehandlinger: () => void;
    lukkModal: () => void;
}

interface OpprettKlageRequest {
    mottattDato: string;
}

const OpprettKlageBehandling: React.FC<Props> = ({
    fagsakId,
    hentKlagebehandlinger,
    lukkModal,
}) => {
    const { request } = useApp();
    const { laster, feilmelding, settFeilmelding, utførOpprett } = useOpprettBehandling();
    const [klageMottattDato, settKlageMottattDato] = useState('');

    const opprett = () => {
        if (!klageMottattDato) {
            settFeilmelding(
                lagFeilmelding('Må sette dato for klage mottatt', RessursStatus.FUNKSJONELL_FEIL)
            );
            return;
        }
        utførOpprett(
            () =>
                request<OpprettBehandlingResponse, OpprettKlageRequest>(
                    `/api/sak/klage/fagsak/${fagsakId}`,
                    'POST',
                    {
                        mottattDato: klageMottattDato,
                    }
                ),
            () => {
                hentKlagebehandlinger();
                lukkModal();
            }
        );
    };

    return (
        <OpprettBehandlingForm
            lukkModal={lukkModal}
            onSubmit={opprett}
            laster={laster}
            feilmelding={feilmelding}
        >
            <DateInput
                label={'Klage mottatt'}
                onChange={(dato: string | undefined) => settKlageMottattDato(dato || '')}
                value={klageMottattDato}
                toDate={new Date()}
            />
        </OpprettBehandlingForm>
    );
};

export default OpprettKlageBehandling;
