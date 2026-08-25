import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Radio, RadioGroup, Select } from '@navikt/ds-react';

import BarnTilRevurdering, { BarnTilRevurderingResponse } from './BarnTilRevurdering';
import { KravMottattDatoFelt } from './KravMottattDatoFelt';
import MetadataNyeOpplysninger from './MetadataNyeOpplysninger';
import { OpprettBehandlingForm } from './OpprettBehandlingForm';
import { OpprettBehandlingResponse } from './opprettBehandlingTypes';
import { OpprettNyBehandlingType } from './OpprettNyBehandlingUtils';
import { useOpprettBehandling } from './useOpprettBehandling';
import { useValiderNyeOpplysningerMetadata } from './validerNyeOpplysningerMetadata';
import { useApp } from '../../../../context/AppContext';
import { lagFeilmelding } from '../../../../komponenter/Feil/feilmeldingUtils';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { BehandlingÅrsak } from '../../../../typer/behandling/behandlingÅrsak';
import { ÅrsakMetadata } from '../../../../typer/behandling/nyeOpplysningerMetadata';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../../typer/ressurs';
import { Toggle } from '../../../../utils/toggles';
import { harVerdi } from '../../../../utils/utils';

interface Props {
    fagsakId: string;
    stønadstype: Stønadstype;
    lukkModal: () => void;
    hentBehandlinger: () => void;
}

interface OpprettBehandlingRequest {
    fagsakId: string;
    årsak: BehandlingÅrsak;
    kravMottatt?: string;
    valgteBarn: string[];
    årsakMetadata?: ÅrsakMetadata;
    forenkletBehandlingstype: OpprettNyBehandlingType;
    skalTillateFlereÅpneBehandlinger: boolean;
    skalSetteSaksbehandlerSomOppgaveEier: boolean;
}

type OppgaveEierValg = 'bli_eier' | 'ikke_bli_eier';

const utledSkalViseBarnTilRevurdering = (
    stønadstype: Stønadstype,
    årsak: BehandlingÅrsak | undefined
): boolean =>
    stønadstype === Stønadstype.BARNETILSYN &&
    !!årsak &&
    [
        BehandlingÅrsak.SØKNAD,
        BehandlingÅrsak.PAPIRSØKNAD,
        BehandlingÅrsak.KORRIGERING_UTEN_BREV,
    ].indexOf(årsak) > -1;

const OpprettOrdinærBehandling: React.FC<Props> = ({
    fagsakId,
    stønadstype,
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
    const [barnTilRevurdering, setBarnTilRevurdering] =
        useState<Ressurs<BarnTilRevurderingResponse>>(byggTomRessurs());
    const [valgteBarn, settValgteBarn] = useState<string[]>([]);
    const [kravMottatt, settKravMottatt] = useState<string | undefined>(undefined);
    const [oppgaveEierValg, settOppgaveEierValg] = useState<OppgaveEierValg | undefined>(undefined);
    const [årsakMetadata, settÅrsakMetadata] = useState<ÅrsakMetadata | undefined>(undefined);

    const kanVelgeÅrsakUtenBrev = useFlag(Toggle.BEHANDLING_ÅRSAK_UTEN_BREV);
    const { feilNyeOpplysningerMetadata, validerNyeOpplysningerMetadata, nullstillFeilForFelt } =
        useValiderNyeOpplysningerMetadata();

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
        if (
            årsak === BehandlingÅrsak.NYE_OPPLYSNINGER &&
            !validerNyeOpplysningerMetadata(årsakMetadata)
        ) {
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
                        valgteBarn,
                        årsakMetadata,
                        forenkletBehandlingstype: OpprettNyBehandlingType.ORDINAER_BEHANDLING,
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
            settFeilmelding(undefined);
            settÅrsakMetadata(undefined);
        } else {
            settÅrsak(undefined);
        }
    };

    const skalViseBarnTilRevurdering = utledSkalViseBarnTilRevurdering(stønadstype, årsak);
    const skalVentePåOkHentingAvBarn =
        skalViseBarnTilRevurdering && barnTilRevurdering.status !== RessursStatus.SUKSESS;

    return (
        <OpprettBehandlingForm
            lukkModal={lukkModal}
            onSubmit={handleSubmit}
            laster={laster}
            feilmelding={feilmelding}
            disableLagre={
                skalVentePåOkHentingAvBarn || (åpneBehandlingerFunnet && !oppgaveEierValg)
            }
        >
            <Select label={'Årsak'} onChange={endreÅrsak}>
                <option value="">- Velg årsak -</option>
                <option value={BehandlingÅrsak.NYE_OPPLYSNINGER}>Nye opplysninger</option>
                <option value={BehandlingÅrsak.SØKNAD}>Søknad</option>
                <option value={BehandlingÅrsak.PAPIRSØKNAD}>Papirsøknad</option>
                <option value={BehandlingÅrsak.OMGJØRING_ETTER_KLAGE}>Omgjøring etter klage</option>
                {kanVelgeÅrsakUtenBrev && (
                    <option value={BehandlingÅrsak.KORRIGERING_UTEN_BREV}>
                        Korrigering uten brev
                    </option>
                )}
            </Select>
            <KravMottattDatoFelt kravMottatt={kravMottatt} onChange={settKravMottatt} />
            {årsak === BehandlingÅrsak.NYE_OPPLYSNINGER && (
                <MetadataNyeOpplysninger
                    årsakMetadata={årsakMetadata}
                    settårsakMetadata={settÅrsakMetadata}
                    feil={feilNyeOpplysningerMetadata}
                    nullstillFeilForFelt={nullstillFeilForFelt}
                />
            )}
            {skalViseBarnTilRevurdering && (
                <BarnTilRevurdering
                    fagsakId={fagsakId}
                    barnTilRevurdering={barnTilRevurdering}
                    settBarnTilRevurdering={setBarnTilRevurdering}
                    settValgteBarn={settValgteBarn}
                />
            )}
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

export default OpprettOrdinærBehandling;
