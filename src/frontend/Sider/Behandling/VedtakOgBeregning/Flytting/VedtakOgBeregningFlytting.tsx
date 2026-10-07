import React, { useState } from 'react';

import { Alert, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import { InnvilgeFlytting } from './innvilgeVedtak/InnvilgeFlytting';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import { InnvilgelseFlytting, VedtakFlytting } from '../../../../typer/vedtak/vedtakFlytting';

export const VedtakOgBeregningFlytting: React.FC = () => {
    const { behandling } = useBehandling();
    const { vedtak } = useVedtak<VedtakFlytting>();

    return (
        <DataViewer type="vedtak" response={{ vedtak }}>
            {({ vedtak }) => (
                <FlyttingVedtak key={behandling.id} lagretVedtak={vedtak || undefined} />
            )}
        </DataViewer>
    );
};

const FlyttingVedtak: React.FC<{ lagretVedtak?: InnvilgelseFlytting }> = ({ lagretVedtak }) => {
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const [typeVedtak, settTypeVedtak] = useState<TypeVedtak | undefined>(
        lagretVedtak ? TypeVedtak.INNVILGELSE : undefined
    );

    return (
        <VStack gap="space-16">
            <Panel tittel="Vedtak">
                <RadioGroup
                    legend="Vedtaksresultat"
                    value={typeVedtak ?? ''}
                    onChange={settTypeVedtak}
                    readOnly={!erStegRedigerbart}
                    size="small"
                >
                    <Radio value={TypeVedtak.INNVILGELSE}>Innvilgelse</Radio>
                    <Radio value={TypeVedtak.AVSLAG}>Avslag</Radio>
                    <Radio value={TypeVedtak.OPPHØR}>Opphør</Radio>
                </RadioGroup>
            </Panel>
            {(typeVedtak === TypeVedtak.AVSLAG || typeVedtak === TypeVedtak.OPPHØR) && (
                <Alert variant="info">
                    Avslag og opphør for flytting er ikke tilgjengelig ennå.
                </Alert>
            )}
            {typeVedtak === TypeVedtak.INNVILGELSE &&
                (behandling.forrigeIverksatteBehandlingId ? (
                    <Alert variant="info">
                        Revurdering av flyttevedtak er ikke tilgjengelig ennå.
                    </Alert>
                ) : (
                    <InnvilgeFlytting lagretVedtak={lagretVedtak} />
                ))}
        </VStack>
    );
};
