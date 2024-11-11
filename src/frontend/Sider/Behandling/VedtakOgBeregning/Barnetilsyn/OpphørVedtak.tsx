import React, { useState } from 'react';

import { Checkbox, CheckboxGroup, Textarea, VStack } from '@navikt/ds-react';

import { FeilmeldingAvslag, valider } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../typer/behandling/steg';
import { erTomtObjekt } from '../../../../typer/typeUtils';
import {
    AvslagBarnetilsyn,
    AvslåBarnetilsynRequest,
    ÅrsakAvslag,
    ÅrsakOpphør,
    årsakOpphørTilTekst,
} from '../../../../typer/vedtak';
import { FanePath } from '../../faner';

const OpphørVedtak: React.FC<{ vedtak?: AvslagBarnetilsyn }> = ({ vedtak }) => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { request, settUlagretKomponent } = useApp();

    const [årsaker, settÅrsaker] = useState<ÅrsakAvslag[]>(vedtak?.årsakerAvslag || []);
    const [begrunnelse, settBegrunnelse] = useState<string>(vedtak?.begrunnelse || '');
    const [feilmeldinger, settFeilmeldinger] = useState<FeilmeldingAvslag>({});

    const lagreVedtak = () => {
        return request<null, AvslåBarnetilsynRequest>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}/avslag`, //TODO: Endre til opphør
            'POST',
            { årsakerAvslag: årsaker, begrunnelse: begrunnelse }
        );
    };

    const validerOgLagreVedtak = () => {
        const feil = valider(årsaker, begrunnelse);
        settFeilmeldinger(feil);

        if (erTomtObjekt(feil)) {
            return lagreVedtak();
        } else {
            return Promise.reject();
        }
    };

    return (
        <VStack gap="4">
            <CheckboxGroup
                legend="Årsak til opphør"
                value={årsaker}
                onChange={(e) => {
                    settÅrsaker(e);
                    settUlagretKomponent(UlagretKomponent.BEREGNING_OPPHØR);
                }}
                readOnly={!erStegRedigerbart}
                size="small"
                error={feilmeldinger.årsaker}
            >
                {Object.keys(ÅrsakOpphør).map((årsak) => (
                    <Checkbox value={årsak} key={årsak}>
                        {årsakOpphørTilTekst[årsak as ÅrsakOpphør]}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <Textarea
                label="Begrunnelse til internt bruk (obligatorisk)"
                value={begrunnelse}
                onChange={(e) => {
                    settBegrunnelse(e.target.value);
                    settUlagretKomponent(UlagretKomponent.BEREGNING_OPPHØR);
                }}
                error={feilmeldinger.begrunnelse}
                readOnly={!erStegRedigerbart}
                size="small"
            />

            <StegKnapp
                steg={Steg.BEREGNE_YTELSE}
                nesteFane={FanePath.SIMULERING}
                onNesteSteg={validerOgLagreVedtak}
                validerUlagedeKomponenter={false}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </VStack>
    );
};

export default OpphørVedtak;
