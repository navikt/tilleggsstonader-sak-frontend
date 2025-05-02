import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { HStack, Switch } from '@navikt/ds-react';

import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import MonthInput from '../../../../komponenter/Skjema/MonthInput';
import { MånedÅrVelger } from '../../../../komponenter/Skjema/MånedÅrVelger/MånedÅrVelger';
import TextField from '../../../../komponenter/Skjema/TextField';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { tilFørsteDagenIMåneden, tilSisteDagenIMåneden } from '../../../../utils/dato';
import { harTallverdi, tilHeltall } from '../../../../utils/tall';
import { Toggle } from '../../../../utils/toggles';
import { fjernSpaces } from '../../../../utils/utils';
import { StønadsvilkårType } from '../../vilkår';
import { vilkårTypeTilUtgiftTekst } from '../tekster';
import { Feilmeldinger } from '../validering';

const StyledSwitch = styled(Switch)`
    align-self: end;
`;

export enum TypePeriodeVelger {
    DATO = 'DATO',
    MANED_ÅR = 'MANED_ÅR',
}

export type EndrePeriodeForVilkårForm = {
    fom: string | undefined;
    tom: string | undefined;
    utgift: number | undefined;
    erFremtidigUtgift: boolean | undefined;
};

const EndrePeriodeForVilkår: React.FC<{
    endrePeriodeForVilkårFrom: EndrePeriodeForVilkårForm;
    oppdaterEndrePeriodeForVilkårForm: (
        key: keyof EndrePeriodeForVilkårForm,
        nyVerdi: string | number | boolean | undefined
    ) => void;
    alleFelterKanRedigeres: boolean;
    settDetFinnesUlagredeEndringer: (value: ((prevState: boolean) => boolean) | boolean) => void;
    vilkårtype: StønadsvilkårType;
    settFeilmeldinger: (
        value: ((prevState: Feilmeldinger) => Feilmeldinger) | Feilmeldinger
    ) => void;
    feilmeldinger: Feilmeldinger;
    typePeriodeVelger: TypePeriodeVelger;
    kanVæreFremtidigUtgift?: boolean;
}> = ({
    endrePeriodeForVilkårFrom,
    oppdaterEndrePeriodeForVilkårForm,
    alleFelterKanRedigeres,
    settDetFinnesUlagredeEndringer,
    vilkårtype,
    settFeilmeldinger,
    feilmeldinger,
    typePeriodeVelger,
    kanVæreFremtidigUtgift,
}) => {
    const skalBrukeMånedÅrVelger = useFlag(Toggle.SKAL_BRUKE_MANED_AR_VELGER);
    const tillaterErFremtidigUtgift = useFlag(Toggle.TILLATER_NULLVEDAK);

    const { fom, tom, utgift, erFremtidigUtgift } = endrePeriodeForVilkårFrom;

    const oppdaterFom = (dato: string | undefined) => {
        oppdaterEndrePeriodeForVilkårForm('fom', dato);
        nullstillFeilmeldingerFor('fom');
        settDetFinnesUlagredeEndringer(true);
    };

    const oppdaterTom = (dato: string | undefined) => {
        oppdaterEndrePeriodeForVilkårForm('tom', dato);
        nullstillFeilmeldingerFor('tom');
        settDetFinnesUlagredeEndringer(true);
    };

    const oppdaterUtgift = (verdi: number | undefined) => {
        oppdaterEndrePeriodeForVilkårForm('utgift', verdi);
        nullstillFeilmeldingerFor('utgift');
        settDetFinnesUlagredeEndringer(true);
    };

    const oppdaterErFremtidigUtgift = (verdi: boolean) => {
        oppdaterEndrePeriodeForVilkårForm('erFremtidigUtgift', verdi);
        nullstillFeilmeldingerFor('erFremtidigUtgift');
        settDetFinnesUlagredeEndringer(true);
    };

    const nullstillFeilmeldingerFor = (felt: keyof EndrePeriodeForVilkårForm) => {
        settFeilmeldinger((prevState) => ({ ...prevState, [felt]: undefined }));
    };

    return (
        <HStack gap="4" align="start">
            <FeilmeldingMaksBredde $maxWidth={152}>
                {typePeriodeVelger == TypePeriodeVelger.DATO ? (
                    <DateInputMedLeservisning
                        label={'Fra'}
                        value={fom}
                        onChange={(dato) => {
                            oppdaterFom(dato);
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
                            oppdaterFom(dato ? tilFørsteDagenIMåneden(dato) : undefined);
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
                            oppdaterFom(dato ? tilFørsteDagenIMåneden(dato) : undefined);
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
                            oppdaterTom(dato);
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
                            oppdaterTom(dato ? tilSisteDagenIMåneden(dato) : undefined);
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
                            oppdaterTom(dato ? tilSisteDagenIMåneden(dato) : undefined);
                        }}
                    />
                )}
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label={`${vilkårTypeTilUtgiftTekst[vilkårtype]}${erFremtidigUtgift ? ' (valgfri)' : ''}`}
                    size="small"
                    erLesevisning={false}
                    value={harTallverdi(utgift) ? utgift : ''}
                    readOnly={!alleFelterKanRedigeres}
                    onChange={(e) => {
                        oppdaterUtgift(tilHeltall(fjernSpaces(e.target.value)));
                    }}
                />
            </FeilmeldingMaksBredde>
            {/*VENTER PÅ AVKLARING PÅ HVORDAN OG OM VI SKAL STØTTE NULLVEDTAK*/}
            {tillaterErFremtidigUtgift &&
                vilkårtype === StønadsvilkårType.UTGIFTER_OVERNATTING &&
                kanVæreFremtidigUtgift && (
                    <StyledSwitch
                        size={'small'}
                        checked={erFremtidigUtgift}
                        onChange={(e) => oppdaterErFremtidigUtgift(e.target.checked)}
                    >
                        Fremtidig utgift
                    </StyledSwitch>
                )}
        </HStack>
    );
};

export default EndrePeriodeForVilkår;
