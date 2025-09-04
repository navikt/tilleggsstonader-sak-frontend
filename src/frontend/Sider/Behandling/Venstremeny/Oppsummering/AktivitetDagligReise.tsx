import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import { FaktaAktivitetDagligReise } from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';

const AktivitetDagligReise: React.FC<{ aktiviteter: FaktaAktivitetDagligReise }> = ({
    aktiviteter,
}) => {
    const reiseperiode = aktiviteter.reiseperiode;

    return (
        <div>
            <VStack gap="2">
                {aktiviteter && (
                    <VStack>
                        <Aktivitet aktivitet={aktiviteter.aktivitet}></Aktivitet>
                    </VStack>
                )}

                {reiseperiode && (
                    <VStack>
                        <Label size={'small'}>Periode du må reise til aktivitetstedet</Label>
                        <BodyShort size="small">
                            {formaterIsoPeriodeMedTankestrek(reiseperiode)}
                        </BodyShort>
                    </VStack>
                )}
            </VStack>
        </div>
    );
};

export default AktivitetDagligReise;
