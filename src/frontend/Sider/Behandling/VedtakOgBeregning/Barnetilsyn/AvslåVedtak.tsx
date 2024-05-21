import React, { useState } from 'react';

import { Checkbox, CheckboxGroup, Textarea } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../typer/behandling/steg';
import {
    AvslagBarnetilsyn,
    AvslåBarnetilsynRequest,
    ÅrsakAvslag,
    årsakAvslagTilTekst,
} from '../../../../typer/vedtak';
import { harVerdi } from '../../../../utils/utils';
import { FanePath } from '../../faner';

const AvslåVedtak: React.FC<{ vedtak?: AvslagBarnetilsyn }> = ({ vedtak }) => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { request } = useApp();

    const [årsakAvslag, settÅrsakAvslag] = useState<ÅrsakAvslag[]>(vedtak?.årsakAvslag || []);
    const [begrunnelse, settBegrunnelse] = useState<string>(vedtak?.begrunnelse || '');
    const [feilmelding, settFeilmelding] = useState<string | undefined>();

    const lagreVedtak = () => {
        return request<null, AvslåBarnetilsynRequest>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}/avslag`,
            'POST',
            { årsakAvslag: årsakAvslag, begrunnelse: begrunnelse }
        );
    };

    const validerOgLagreVedtak = () => {
        if (!harVerdi(begrunnelse)) {
            settFeilmelding('Begrunnelse for avslag må fylles ut');
            return Promise.reject();
        } else {
            settFeilmelding(undefined);
            return lagreVedtak();
        }
    };

    return (
        <>
            <CheckboxGroup
                legend="Årsak til avslag"
                value={årsakAvslag}
                onChange={(e) => {
                    settÅrsakAvslag(e);
                }}
                readOnly={!erStegRedigerbart}
                size="small"
            >
                {Object.keys(ÅrsakAvslag).map((årsak) => (
                    <Checkbox value={årsak}>{årsakAvslagTilTekst[årsak as ÅrsakAvslag]}</Checkbox>
                ))}
            </CheckboxGroup>
            <Textarea
                label="Begrunnelse for avslag"
                value={begrunnelse}
                onChange={(e) => settBegrunnelse(e.target.value)}
                error={feilmelding}
                readOnly={!erStegRedigerbart}
                style={{ width: '40rem' }}
                size="small"
            />

            <StegKnapp
                steg={Steg.BEREGNE_YTELSE}
                nesteFane={FanePath.BREV}
                onNesteSteg={validerOgLagreVedtak}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </>
    );
};

export default AvslåVedtak;
