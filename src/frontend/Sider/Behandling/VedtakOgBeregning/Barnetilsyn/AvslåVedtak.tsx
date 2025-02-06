import React, { useState } from 'react';

import { Checkbox, CheckboxGroup, Textarea, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Steg } from '../../../../typer/behandling/steg';
import { erTomtObjekt } from '../../../../typer/typeUtils';
import {
    TypeVedtak,
    ÅrsakAvslag,
    årsakAvslagTilTekst,
    årsakerForStønad,
} from '../../../../typer/vedtak/vedtak';
import {
    AvslagBarnetilsyn,
    AvslåBarnetilsynRequest,
} from '../../../../typer/vedtak/vedtakTilsynBarn';
import { FanePath } from '../../faner';
import { FeilmeldingVedtak, valider } from '../Felles/validering';

const AvslåVedtak: React.FC<{ vedtak?: AvslagBarnetilsyn }> = ({ vedtak }) => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { request, settUlagretKomponent } = useApp();

    const [årsaker, settÅrsaker] = useState<ÅrsakAvslag[]>(vedtak?.årsakerAvslag || []);
    const [begrunnelse, settBegrunnelse] = useState<string>(vedtak?.begrunnelse || '');
    const [feilmeldinger, settFeilmeldinger] = useState<FeilmeldingVedtak>({});

    const lagreVedtak = () => {
        return request<null, AvslåBarnetilsynRequest>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}/avslag`,
            'POST',
            { type: TypeVedtak.AVSLAG, årsakerAvslag: årsaker, begrunnelse: begrunnelse }
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
                {årsakerForStønad[Stønadstype.BARNETILSYN].map((årsak) => (
                    <Checkbox value={årsak} key={årsak}>
                        {årsakAvslagTilTekst[årsak as ÅrsakAvslag]}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <Textarea
                label="Begrunnelse for avslag (obligatorisk)"
                value={begrunnelse}
                onChange={(e) => {
                    settBegrunnelse(e.target.value);
                    settUlagretKomponent(UlagretKomponent.BEREGNING_AVSLÅ);
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

export default AvslåVedtak;
