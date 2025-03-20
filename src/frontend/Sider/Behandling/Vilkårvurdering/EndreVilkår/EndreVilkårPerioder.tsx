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
import { Feilmeldinger } from '../validering';

const StyledSwitch = styled(Switch)`
    align-self: end;
`;

interface EndreVilkårPerioderProps {
    fom: string | undefined;
    settFom: (fom: string | undefined) => void;
    tom: string | undefined;
    settTom: (tom: string | undefined) => void;
    erMidlertidigOvernatting: boolean;
    settFeilmeldinger: (
        value: ((prevState: Feilmeldinger) => Feilmeldinger) | Feilmeldinger
    ) => void;
    feilmeldinger: Feilmeldinger;
    alleFelterKanRedigeres: boolean;
    settDetFinnesUlagredeEndringer: (value: ((prevState: boolean) => boolean) | boolean) => void;
    utgift: number | undefined;
    settUtgift: (
        value: ((prevState: number | undefined) => number | undefined) | number | undefined
    ) => void;
    erNullvedtak: undefined | boolean;
    oppdaterErNullvedtak: (erNullvedtak: boolean) => void;
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
    oppdaterErNullvedtak,
}: EndreVilkårPerioderProps) => {
    const skalBrukeMånedÅrVelger = useFlag(Toggle.SKAL_BRUKE_MANED_AR_VELGER);

    return (
        <HStack gap="4" align="start">
            <FeilmeldingMaksBredde $maxWidth={152}>
                {erMidlertidigOvernatting ? (
                    <DateInputMedLeservisning
                        label={'Fra'}
                        value={fom}
                        onChange={(dato) => {
                            settFom(dato);
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
                    label={erMidlertidigOvernatting ? 'Utgift' : 'Månedlig utgift'}
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
