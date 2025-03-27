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

interface EndreVilkårPerioderProps {
    fom: string | undefined;
    tom: string | undefined;
    feilmeldinger: Feilmeldinger;
    erMidlertidigOvernatting: boolean;
    utgift: number | undefined;
    alleFelterKanRedigeres: boolean;
    erNullvedtak: undefined | boolean;
    settFom: (fom: string | undefined) => void;
    settTom: (tom: string | undefined) => void;
    settFeilmeldinger: (
        value: ((prevState: Feilmeldinger) => Feilmeldinger) | Feilmeldinger
    ) => void;
    settDetFinnesUlagredeEndringer: (value: ((prevState: boolean) => boolean) | boolean) => void;
    settUtgift: (
        value: ((prevState: number | undefined) => number | undefined) | number | undefined
    ) => void;
    settErNullvedtak: (
        value: ((prevState: boolean | undefined) => boolean | undefined) | boolean | undefined
    ) => void;
    vilkårtype: StønadsvilkårType;
}

const EndreVilkårPerioder = ({
    fom,
    settFom,
    tom,
    settTom,
    erMidlertidigOvernatting,
    settFeilmeldinger,
    feilmeldinger,
    alleFelterKanRedigeres,
    settDetFinnesUlagredeEndringer,
    utgift,
    settUtgift,
    erNullvedtak,
    settErNullvedtak,
    vilkårtype,
}: EndreVilkårPerioderProps) => {
    const skalBrukeMånedÅrVelger = useFlag(Toggle.SKAL_BRUKE_MANED_AR_VELGER);

    const oppdaterErNullvedtak = (erNullvedtak: boolean) => {
        settUtgift(undefined);
        settErNullvedtak(erNullvedtak);
    };

    return (
        <HStack gap="4" align="start">
            <FeilmeldingMaksBredde $maxWidth={152}>
                {erMidlertidigOvernatting ? (
                    <DateInputMedLeservisning
                        label={'Fra'}
                        value={fom}
                        onChange={(dato) => {
                            settFom(dato);
                            settDetFinnesUlagredeEndringer(true);
                            settFeilmeldinger((prevState) => ({ ...prevState, fom: undefined }));
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
                            settFom(dato ? tilFørsteDagenIMåneden(dato) : undefined);
                            settDetFinnesUlagredeEndringer(true);
                            settFeilmeldinger((prevState) => ({ ...prevState, fom: undefined }));
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
                            settFom(dato ? tilFørsteDagenIMåneden(dato) : undefined);
                            settDetFinnesUlagredeEndringer(true);
                            settFeilmeldinger((prevState) => ({ ...prevState, fom: undefined }));
                        }}
                    />
                )}
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={152}>
                {erMidlertidigOvernatting ? (
                    <DateInputMedLeservisning
                        label={'Til'}
                        value={tom}
                        onChange={(dato) => {
                            settTom(dato);
                            settDetFinnesUlagredeEndringer(true);
                            settFeilmeldinger((prevState) => ({ ...prevState, tom: undefined }));
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
                            settTom(dato ? tilSisteDagenIMåneden(dato) : undefined);
                            settDetFinnesUlagredeEndringer(true);
                            settFeilmeldinger((prevState) => ({ ...prevState, tom: undefined }));
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
                            settTom(dato ? tilSisteDagenIMåneden(dato) : undefined);
                            settDetFinnesUlagredeEndringer(true);
                            settFeilmeldinger((prevState) => ({ ...prevState, tom: undefined }));
                        }}
                    />
                )}
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde $maxWidth={180}>
                <TextField
                    label={vilkårTypeTilUtgiftTekst[vilkårtype]}
                    size="small"
                    erLesevisning={false}
                    value={harTallverdi(utgift) ? utgift : ''}
                    readOnly={!alleFelterKanRedigeres || erNullvedtak}
                    onChange={(e) => {
                        settDetFinnesUlagredeEndringer(true);
                        settUtgift(tilHeltall(fjernSpaces(e.target.value)));
                    }}
                />
            </FeilmeldingMaksBredde>
            {erMidlertidigOvernatting && (
                <StyledSwitch
                    size={'small'}
                    checked={erNullvedtak}
                    onChange={(e) => oppdaterErNullvedtak(e.target.checked)}
                >
                    Nullvedtak
                </StyledSwitch>
            )}
        </HStack>
    );
};

export default EndreVilkårPerioder;
