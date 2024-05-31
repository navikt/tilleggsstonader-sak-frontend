import React, { useState } from 'react';

import styled from 'styled-components';

import { Checkbox, CheckboxGroup, Textarea } from '@navikt/ds-react';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

import { FeilmeldingAvslag, valider } from './validering';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { erTomtObjekt } from '../../../../../typer/typeUtils';
import {
    AvslagBarnetilsyn,
    AvslåBarnetilsynRequest,
    ÅrsakAvslag,
    årsakAvslagTilTekst,
} from '../../../../../typer/vedtak';
import { FanePath } from '../../../faner';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-left: 1rem;

    border-left: 4px solid ${ABlue500};
`;

const AvslåVedtak: React.FC<{ vedtak?: AvslagBarnetilsyn }> = ({ vedtak }) => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { request, settUlagretKomponent } = useApp();

    const [årsaker, settÅrsaker] = useState<ÅrsakAvslag[]>(vedtak?.årsakerAvslag || []);
    const [begrunnelse, settBegrunnelse] = useState<string>(vedtak?.begrunnelse || '');
    const [feilmeldinger, settFeilmeldinger] = useState<FeilmeldingAvslag>({});

    const lagreVedtak = () => {
        return request<null, AvslåBarnetilsynRequest>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}/avslag`,
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
        <Container>
            <CheckboxGroup
                legend="Årsak til avslag"
                value={årsaker}
                onChange={(e) => {
                    settÅrsaker(e);
                    settUlagretKomponent(UlagretKomponent.BEREGNING_AVSLÅ);
                }}
                readOnly={!erStegRedigerbart}
                size="small"
                error={feilmeldinger.årsaker}
            >
                {Object.keys(ÅrsakAvslag).map((årsak) => (
                    <Checkbox value={årsak} key={årsak}>
                        {årsakAvslagTilTekst[årsak as ÅrsakAvslag]}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <Textarea
                label="Begrunnelse for avslag"
                value={begrunnelse}
                onChange={(e) => {
                    settBegrunnelse(e.target.value);
                    settUlagretKomponent(UlagretKomponent.BEREGNING_AVSLÅ);
                }}
                error={feilmeldinger.begrunnelse}
                readOnly={!erStegRedigerbart}
                style={{ width: '40rem' }}
                size="small"
            />

            <StegKnapp
                steg={Steg.BEREGNE_YTELSE}
                nesteFane={FanePath.BREV}
                onNesteSteg={validerOgLagreVedtak}
                validerUlagedeKomponenter={false}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </Container>
    );
};

export default AvslåVedtak;
