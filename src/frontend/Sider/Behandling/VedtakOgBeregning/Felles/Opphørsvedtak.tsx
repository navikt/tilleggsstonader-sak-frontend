import React, { useState } from 'react';

import { Checkbox, CheckboxGroup, Textarea, VStack } from '@navikt/ds-react';

import { FeilmeldingVedtak, valider } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useSteg } from '../../../../context/StegContext';
import { OpphørRequest, useLagreOpphør } from '../../../../hooks/useLagreOpphør';
import { UlagretKomponent } from '../../../../hooks/useUlagredeKomponenter';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../typer/behandling/steg';
import { erTomtObjekt } from '../../../../typer/typeUtils';
import { ÅrsakOpphør, årsakOpphørTilTekst } from '../../../../typer/vedtak/vedtak';
import { FanePath } from '../../faner';

const OpphørVedtak: React.FC<{
    vedtak?: OpphørRequest;
}> = ({ vedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { settUlagretKomponent } = useApp();

    const { lagreOpphør } = useLagreOpphør();

    const [årsaker, settÅrsaker] = useState<ÅrsakOpphør[]>(vedtak?.årsakerOpphør || []);
    const [begrunnelse, settBegrunnelse] = useState<string>(vedtak?.begrunnelse || '');
    const [feilmeldinger, settFeilmeldinger] = useState<FeilmeldingVedtak>({});

    const validerOgLagreVedtak = () => {
        const feil = valider(årsaker, begrunnelse);
        settFeilmeldinger(feil);

        if (erTomtObjekt(feil)) {
            return lagreOpphør(årsaker, begrunnelse);
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
                style={{ maxWidth: '20em' }}
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
