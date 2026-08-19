import React, { useState } from 'react';

import { Radio, RadioGroup, Select } from '@navikt/ds-react';

import { KravMottattDatoFelt } from './KravMottattDatoFelt';
import { OpprettBehandlingForm } from './OpprettBehandlingForm';
import { OpprettBehandlingResponse } from './opprettBehandlingTypes';
import { OpprettNyBehandlingType } from './OpprettNyBehandlingUtils';
import { useOpprettBehandling } from './useOpprettBehandling';
import { useApp } from '../../../../context/AppContext';
import { lagFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import { BehandlingÅrsak } from '../../../../typer/behandling/behandlingÅrsak';
import { harVerdi } from '../../../../utils/utils';

interface Props {
    fagsakId: string;
    lukkModal: () => void;
    hentBehandlinger: () => void;
}

interface OpprettBehandlingRequest {
    fagsakId: string;
    årsak: BehandlingÅrsak;
    kravMottatt?: string;
    forenkletBehandlingstype: OpprettNyBehandlingType;
    skalTillateFlereÅpneBehandlinger: boolean;
    skalSetteSaksbehandlerSomOppgaveEier: boolean;
}

type OppgaveEierValg = 'bli_eier' | 'ikke_bli_eier';

const OpprettKjørelisteBehandling: React.FC<Props> = ({
    fagsakId,
    lukkModal,
    hentBehandlinger,
}) => {
    const { request } = useApp();
    const {
        laster,
        feilmelding,
        settFeilmelding,
        åpneBehandlingerFunnet,
        settÅpneBehandlingerFunnet,
        utførOpprett,
    } = useOpprettBehandling();

    const [årsak, settÅrsak] = useState<BehandlingÅrsak>();
    const [kravMottatt, settKravMottatt] = useState<string | undefined>(undefined);
    const [oppgaveEierValg, settOppgaveEierValg] = useState<OppgaveEierValg | undefined>(undefined);

    const opprett = (
        skalTillateFlereÅpneBehandlinger = false,
        skalSetteSaksbehandlerSomOppgaveEier = false
    ) => {
        if (!årsak) {
            settFeilmelding(lagFeilmelding('Mangler årsak'));
            return;
        }
        if (!kravMottatt) {
            settFeilmelding(lagFeilmelding('Krav mottatt må settes'));
            return;
        }
        utførOpprett(
            () =>
                request<OpprettBehandlingResponse, OpprettBehandlingRequest>(
                    `/api/sak/behandling/v2`,
                    'POST',
                    {
                        fagsakId,
                        årsak,
                        kravMottatt,
                        forenkletBehandlingstype: OpprettNyBehandlingType.KJØRELISTE,
                        skalTillateFlereÅpneBehandlinger,
                        skalSetteSaksbehandlerSomOppgaveEier,
                    }
                ),
            () => {
                hentBehandlinger();
                lukkModal();
            }
        );
    };

    const handleSubmit = () => {
        if (åpneBehandlingerFunnet) {
            opprett(true, oppgaveEierValg === 'bli_eier');
        } else {
            opprett();
        }
    };

    const endreÅrsak = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (harVerdi(value)) {
            settÅrsak(value as BehandlingÅrsak);
        } else {
            settÅrsak(undefined);
        }
    };

    return (
        <OpprettBehandlingForm
            lukkModal={lukkModal}
            onSubmit={handleSubmit}
            laster={laster}
            feilmelding={feilmelding}
            disableLagre={åpneBehandlingerFunnet && !oppgaveEierValg}
        >
            <Select label={'Årsak'} onChange={endreÅrsak}>
                <option value="">- Velg årsak -</option>
                <option value={BehandlingÅrsak.REGISTRER_KJØRELISTE_FOR_BRUKER}>
                    Registrer kjøreliste for bruker
                </option>
            </Select>
            <KravMottattDatoFelt kravMottatt={kravMottatt} onChange={settKravMottatt} />
            {åpneBehandlingerFunnet && (
                <RadioGroup
                    legend="Det finnes åpne behandlinger"
                    description="Din oppgave vil settes på vent. Velg hvordan du vil gå videre."
                    value={oppgaveEierValg ?? ''}
                    onChange={(val) => {
                        settÅpneBehandlingerFunnet(true);
                        settOppgaveEierValg(val as OppgaveEierValg);
                    }}
                >
                    <Radio value="bli_eier">Opprett og bli oppgaveeier</Radio>
                    <Radio value="ikke_bli_eier">Opprett uten å være oppgaveeier</Radio>
                </RadioGroup>
            )}
        </OpprettBehandlingForm>
    );
};

export default OpprettKjørelisteBehandling;
