import React, { useState } from 'react';

import { Checkbox, CheckboxGroup, Textarea, VStack } from '@navikt/ds-react';

import { FeilmeldingVedtak, valider } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { AvslagRequest, useLagreAvslag } from '../../../../hooks/useLagreAvslag';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../typer/behandling/steg';
import { erTomtObjekt } from '../../../../typer/typeUtils';
import {
    ÅrsakAvslag,
    årsakAvslagTilTekst,
    årsakerForStønad,
} from '../../../../typer/vedtak/vedtak';
import { FanePath } from '../../faner';

export const AvslåVedtak: React.FC<{
    vedtak?: AvslagRequest;
    steg?: Steg;
    nesteFane?: FanePath;
}> = ({ vedtak, steg = Steg.BEREGNE_YTELSE, nesteFane = FanePath.SIMULERING }) => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { settUlagretKomponent } = useApp();

    const { lagreAvslag } = useLagreAvslag();

    const [årsaker, settÅrsaker] = useState<ÅrsakAvslag[]>(vedtak?.årsakerAvslag || []);
    const [begrunnelse, settBegrunnelse] = useState<string>(vedtak?.begrunnelse || '');
    const [feilmeldinger, settFeilmeldinger] = useState<FeilmeldingVedtak>({});

    const validerOgLagreVedtak = () => {
        const feil = valider(årsaker, begrunnelse);
        settFeilmeldinger(feil);

        if (erTomtObjekt(feil)) {
            return lagreAvslag(årsaker, begrunnelse);
        } else {
            return Promise.reject();
        }
    };

    return (
        <VStack gap="space-16">
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
                {årsakerForStønad[behandling.stønadstype].map((årsak) => (
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
                steg={steg}
                nesteFane={nesteFane}
                onNesteSteg={validerOgLagreVedtak}
                validerUlagedeKomponenter={false}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </VStack>
    );
};
