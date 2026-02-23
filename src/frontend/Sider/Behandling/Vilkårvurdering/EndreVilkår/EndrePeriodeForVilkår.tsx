import React from 'react';

import { HStack } from '@navikt/ds-react';

import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import { MånedÅrVelger } from '../../../../komponenter/Skjema/MånedÅrVelger/MånedÅrVelger';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import {
    tilFørsteDagenIMånedenNullable,
    tilSisteDagenIMånedenNullable,
} from '../../../../utils/dato';
import { Feilmeldinger } from '../validering';

export enum TypePeriodeVelger {
    DATO = 'DATO',
    MANED_ÅR = 'MANED_ÅR',
}

export type PeriodeForVilkår = {
    fom: string | undefined;
    tom: string | undefined;
};

const EndrePeriodeForVilkår: React.FC<{
    periodeForVilkår: PeriodeForVilkår;
    oppdaterPeriodeForVilkår: (key: keyof PeriodeForVilkår, nyVerdi: string | undefined) => void;
    feilmeldinger: Feilmeldinger;
    typePeriodeVelger: TypePeriodeVelger;
}> = ({ periodeForVilkår, oppdaterPeriodeForVilkår, feilmeldinger, typePeriodeVelger }) => {
    const { fom, tom } = periodeForVilkår;

    return (
        <HStack gap="space-16" align="start">
            <FeilmeldingMaksBredde $maxWidth={152}>
                {typePeriodeVelger == TypePeriodeVelger.DATO ? (
                    <DateInputMedLeservisning
                        label={'Fra'}
                        value={fom}
                        onChange={(dato) => {
                            oppdaterPeriodeForVilkår('fom', dato);
                        }}
                        size="small"
                        feil={feilmeldinger.fom}
                    />
                ) : (
                    <MånedÅrVelger
                        label="Fra"
                        årMånedInitiell={fom}
                        feilmelding={feilmeldinger.fom}
                        onEndret={(dato) => {
                            oppdaterPeriodeForVilkår('fom', tilFørsteDagenIMånedenNullable(dato));
                        }}
                        antallÅrFrem={1}
                        antallÅrTilbake={1}
                    />
                )}
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={152}>
                {typePeriodeVelger == TypePeriodeVelger.DATO ? (
                    <DateInputMedLeservisning
                        label={'Til'}
                        value={tom}
                        onChange={(dato) => {
                            oppdaterPeriodeForVilkår('tom', dato);
                        }}
                        size="small"
                        feil={feilmeldinger.tom}
                    />
                ) : (
                    <MånedÅrVelger
                        label="Til"
                        årMånedInitiell={tom}
                        feilmelding={feilmeldinger.tom}
                        onEndret={(dato) => {
                            oppdaterPeriodeForVilkår('tom', tilSisteDagenIMånedenNullable(dato));
                        }}
                        antallÅrFrem={2}
                        antallÅrTilbake={1}
                    />
                )}
            </FeilmeldingMaksBredde>
        </HStack>
    );
};

export default EndrePeriodeForVilkår;
