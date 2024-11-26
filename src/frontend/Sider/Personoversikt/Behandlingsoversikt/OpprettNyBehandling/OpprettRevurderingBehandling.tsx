import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { Button, HStack, Select, VStack } from '@navikt/ds-react';

import BarnTilRevurdering, { BarnTilRevurderingResponse } from './BarnTilRevurdering';
import { useApp } from '../../../../context/AppContext';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { BehandlingÅrsak } from '../../../../typer/behandling/behandlingÅrsak';
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
    valgteBarn: string[];
}

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
// TODO skal ikke kunne velge nye barn etter opprydding av de 2 sakene som trenger det

const OpprettRevurderingBehandling: React.FC<Props> = ({
    fagsakId,
    stønadstype,
    lukkModal,
    hentBehandlinger,
}) => {
    const { request } = useApp();

    const [årsak, settÅrsak] = useState<BehandlingÅrsak>();
    const [barnTilRevurdering, setBarnTilRevurdering] =
        useState<Ressurs<BarnTilRevurderingResponse>>(byggTomRessurs());
    const [valgteBarn, settValgteBarn] = useState<string[]>([]);

    const [laster, settLaster] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const kanVelgeÅrsakUtenBrev = useFlag(Toggle.BEHANDLING_ÅRSAK_UTEN_BREV);

    const opprett = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        if (!årsak) {
            settFeilmelding('Mangler årsak');
            return;
        }
        request<string, OpprettBehandlingRequest>(`/api/sak/behandling`, 'POST', {
            fagsakId: fagsakId,
            årsak: årsak,
            valgteBarn: valgteBarn,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentBehandlinger();
                lukkModal();
            } else {
                settFeilmelding(response.frontendFeilmelding || response.melding);
                settLaster(false);
            }
        });
    };

    const endreÅrsak = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (harVerdi(value)) {
            settÅrsak(value as BehandlingÅrsak);
        } else {
            settÅrsak(undefined);
        }
    };

    const skalViseBarnTilRevurdering = utledSkalViseBarnTilRevurdering(stønadstype, årsak);
    const skalVentePåOkHentingAvBarn =
        skalViseBarnTilRevurdering && barnTilRevurdering.status !== RessursStatus.SUKSESS;
    return (
        <VStack gap="4">
            <Select label={'Årsak'} onChange={endreÅrsak}>
                <option value="">- Velg årsak -</option>
                <option value={BehandlingÅrsak.NYE_OPPLYSNINGER}>Nye opplysninger</option>
                <option value={BehandlingÅrsak.SØKNAD}>Søknad</option>
                <option value={BehandlingÅrsak.PAPIRSØKNAD}>Papirsøknad</option>
                {kanVelgeÅrsakUtenBrev && (
                    <option value={BehandlingÅrsak.KORRIGERING_UTEN_BREV}>
                        Korrigering uten brev
                    </option>
                )}
            </Select>

            {skalViseBarnTilRevurdering && (
                <BarnTilRevurdering
                    fagsakId={fagsakId}
                    barnTilRevurdering={barnTilRevurdering}
                    settBarnTilRevurdering={setBarnTilRevurdering}
                    settValgteBarn={settValgteBarn}
                />
            )}

            <HStack gap="4" justify={'end'}>
                <Button variant="tertiary" onClick={lukkModal} size="small">
                    Avbryt
                </Button>
                <Button
                    variant="primary"
                    onClick={opprett}
                    size="small"
                    disabled={skalVentePåOkHentingAvBarn}
                >
                    Lagre
                </Button>
            </HStack>
            <Feilmelding variant={'alert'}>{feilmelding}</Feilmelding>
        </VStack>
    );
};

export default OpprettRevurderingBehandling;
