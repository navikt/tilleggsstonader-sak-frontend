import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import { FaktaAktivitetDagligReise } from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';
import { formaterIsoDato } from '../../../../utils/dato';

const AktivitetDagligReise: React.FC<{ aktiviteter: FaktaAktivitetDagligReise }> = ({
    aktiviteter,
}) => {
    const reiseperiode = aktiviteter.reiseperiode;

    return (
        <div>
            <VStack>
                {aktiviteter && (
                    <VStack>
                        <Aktivitet aktivitet={aktiviteter.aktivitet}></Aktivitet>
                    </VStack>
                )}
            </VStack>
            {reiseperiode && (
                <VStack>
                    <Label size={'small'}>Periode du må reise til aktivitet stedet</Label>
                    <BodyShort size="small">
                        {formaterIsoDato(reiseperiode.fom)} - {formaterIsoDato(reiseperiode.tom)}
                    </BodyShort>
                </VStack>
            )}
        </div>
    );
};

export default AktivitetDagligReise;
