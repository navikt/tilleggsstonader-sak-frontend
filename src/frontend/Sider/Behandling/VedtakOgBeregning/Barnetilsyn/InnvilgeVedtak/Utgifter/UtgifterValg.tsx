import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label } from '@navikt/ds-react';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import DateInputMedLeservisning from '../../../../../../komponenter/Skjema/DateInputMedLeservisning';
import TextField from '../../../../../../komponenter/Skjema/TextField';
import { Utgift, UtgifterProperty } from '../../../../../../typer/vedtak';
import { tilÅrMåned } from '../../../../../../utils/dato';
import { harTallverdi, tilTallverdi } from '../../../../../../utils/tall';
import { GrunnlagBarn } from '../../../../vilkår';
import { leggTilTomRadUnderIListe, tomUtgiftRad } from '../../utils';
import { InnvilgeVedtakForm } from '../InnvilgeBarnetilsyn';

const Grid = styled.div<{ $lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;

    > :nth-child(4n) {
        grid-column: 1;
    }
`;

interface Props {
    errorState: FormErrors<Utgift[]>;
    utgifter: Utgift[];
    barn: GrunnlagBarn;
    oppdaterUtgiter: (utgifter: Utgift[]) => void;
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const UtgifterValg: React.FC<Props> = ({
    utgifter,
    barn,
    errorState,
    oppdaterUtgiter,
    settValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

    const oppdaterUtgift = (utgiftIndex: number, oppdatertUtgift: Utgift) => {
        const oppdaterteUtgifter = utgifter.map((utgift, indeks) =>
            indeks === utgiftIndex ? oppdatertUtgift : utgift
        );

        oppdaterUtgiter(oppdaterteUtgifter);
    };

    const oppdaterUtgiftFelt = (
        indeks: number,
        property: UtgifterProperty,
        value: string | number | undefined
    ) => {
        oppdaterUtgift(indeks, {
            ...utgifter[indeks],
            [property]: value,
        });
    };

    const leggTilTomRadUnder = (utgiftIndex: number) => {
        oppdaterUtgiter(leggTilTomRadUnderIListe(utgifter, tomUtgiftRad(), utgiftIndex));
    };

    const slettPeriode = (barnId: string, utgiftIndex: number) => {
        const oppdaterteUtgifter = utgifter.filter((_, i) => i != utgiftIndex);

        oppdaterUtgiter(oppdaterteUtgifter);

        settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
            const utgiftsperioder = (
                (prevState.utgifter && prevState.utgifter[barnId]) ??
                []
            ).splice(utgiftIndex, 1);
            return { ...prevState, utgiftsperioder };
        });
    };

    return (
        <div>
            <Heading spacing size="xsmall" level="5">
                {barn.registergrunnlag.navn}
            </Heading>
            {utgifter && utgifter.length > 0 && (
                <Grid $lesevisning={!behandlingErRedigerbar}>
                    <Label size="small">Månedlig utgift</Label>
                    <Label size="small">Fra</Label>
                    <Label size="small">Til</Label>

                    {utgifter.map((utgiftsperiode, indeks) => (
                        <React.Fragment key={utgiftsperiode.endretKey}>
                            <TextField
                                erLesevisning={!behandlingErRedigerbar}
                                label="Utgifter"
                                hideLabel
                                value={
                                    harTallverdi(utgiftsperiode.utgift) ? utgiftsperiode.utgift : ''
                                }
                                onChange={(e) =>
                                    oppdaterUtgiftFelt(
                                        indeks,
                                        UtgifterProperty.UTGIFT,
                                        tilTallverdi(e.target.value)
                                    )
                                }
                                error={errorState && errorState[indeks]?.utgift}
                                size="small"
                                autoComplete="off"
                            />
                            <DateInputMedLeservisning
                                label="Fra"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.fom}
                                onChange={(dato?: string) =>
                                    oppdaterUtgiftFelt(
                                        indeks,
                                        UtgifterProperty.FOM,
                                        dato ? tilÅrMåned(new Date(dato)) : undefined
                                    )
                                }
                                feil={errorState && errorState[indeks]?.fom}
                                size="small"
                            />
                            <DateInputMedLeservisning
                                label="Til"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.tom}
                                onChange={(dato?: string) =>
                                    oppdaterUtgiftFelt(
                                        indeks,
                                        UtgifterProperty.TOM,
                                        dato ? tilÅrMåned(new Date(dato)) : undefined
                                    )
                                }
                                feil={errorState && errorState[indeks]?.tom}
                                size="small"
                            />
                            <div>
                                <Button
                                    type="button"
                                    onClick={() => leggTilTomRadUnder(indeks)}
                                    variant="tertiary"
                                    icon={<PlusCircleIcon />}
                                    size="small"
                                />
                                {indeks !== 0 && (
                                    <Button
                                        type="button"
                                        onClick={() => slettPeriode(barn.barnId, indeks)}
                                        variant="tertiary"
                                        icon={<TrashIcon />}
                                        size="small"
                                    />
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </Grid>
            )}
        </div>
        // {/* <Button onClick={leggTilTomRadUnder}>Legg til utgift</Button> */}
    );
};

export default UtgifterValg;
