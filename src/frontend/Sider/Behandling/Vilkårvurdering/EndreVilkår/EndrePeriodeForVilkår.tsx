import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { HStack } from '@navikt/ds-react';

import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import MonthInput from '../../../../komponenter/Skjema/MonthInput';
import { MånedÅrVelger } from '../../../../komponenter/Skjema/MånedÅrVelger/MånedÅrVelger';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { tilFørsteDagenIMåneden, tilSisteDagenIMåneden } from '../../../../utils/dato';
import { Toggle } from '../../../../utils/toggles';
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
    alleFelterKanRedigeres: boolean;
    feilmeldinger: Feilmeldinger;
    typePeriodeVelger: TypePeriodeVelger;
}> = ({
    periodeForVilkår,
    oppdaterPeriodeForVilkår,
    alleFelterKanRedigeres,
    feilmeldinger,
    typePeriodeVelger,
}) => {
    const skalBrukeMånedÅrVelger = useFlag(Toggle.SKAL_BRUKE_MANED_AR_VELGER);
    const { fom, tom } = periodeForVilkår;

    return (
        <HStack gap="4" align="start">
            <FeilmeldingMaksBredde $maxWidth={152}>
                {typePeriodeVelger == TypePeriodeVelger.DATO ? (
                    <DateInputMedLeservisning
                        label={'Fra'}
                        value={fom}
                        onChange={(dato) => {
                            oppdaterPeriodeForVilkår('fom', dato);
                        }}
                        readOnly={!alleFelterKanRedigeres}
                        size="small"
                        feil={feilmeldinger.fom}
                    />
                ) : skalBrukeMånedÅrVelger ? (
                    <MånedÅrVelger
                        label="Fra"
                        size="small"
                        årMånedInitiell={fom}
                        feilmelding={feilmeldinger.fom}
                        lesevisning={!alleFelterKanRedigeres}
                        onEndret={(dato) => {
                            oppdaterPeriodeForVilkår(
                                'fom',
                                dato ? tilFørsteDagenIMåneden(dato) : undefined
                            );
                        }}
                        antallÅrFrem={1}
                        antallÅrTilbake={1}
                    />
                ) : (
                    <MonthInput
                        label="Fra"
                        size="small"
                        value={fom}
                        feil={feilmeldinger.fom}
                        readOnly={!alleFelterKanRedigeres}
                        onChange={(dato) => {
                            oppdaterPeriodeForVilkår(
                                'fom',
                                dato ? tilFørsteDagenIMåneden(dato) : undefined
                            );
                        }}
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
                ) : skalBrukeMånedÅrVelger ? (
                    <MånedÅrVelger
                        label="Til"
                        size="small"
                        årMånedInitiell={tom}
                        feilmelding={feilmeldinger.tom}
                        onEndret={(dato) => {
                            oppdaterPeriodeForVilkår(
                                'tom',
                                dato ? tilSisteDagenIMåneden(dato) : undefined
                            );
                        }}
                        antallÅrFrem={2}
                        antallÅrTilbake={1}
                    />
                ) : (
                    <MonthInput
                        label="Til"
                        size="small"
                        value={tom}
                        feil={feilmeldinger.tom}
                        onChange={(dato) => {
                            oppdaterPeriodeForVilkår(
                                'tom',
                                dato ? tilSisteDagenIMåneden(dato) : undefined
                            );
                        }}
                    />
                )}
            </FeilmeldingMaksBredde>
        </HStack>
    );
};

export default EndrePeriodeForVilkår;
