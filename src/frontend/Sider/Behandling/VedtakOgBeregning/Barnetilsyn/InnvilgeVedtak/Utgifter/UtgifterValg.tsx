import React from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label } from '@navikt/ds-react';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import TextField from '../../../../../../komponenter/Skjema/TextField';
import { Utgift, UtgifterProperty } from '../../../../../../typer/vedtak';
import { tilÅrMåned } from '../../../../../../utils/dato';
import { harTallverdi, tilTallverdi } from '../../../../../../utils/tall';
import { GrunnlagBarn } from '../../../../vilkår';

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
    oppdaterUtgift: (utgiftIndeks: number, utgift: Utgift) => void;
    leggTilTomRadUnder: (utgiftIndeks: number) => void;
    slettPeriode: (utgiftIndeks: number) => void;
}

const UtgifterValg: React.FC<Props> = ({
    utgifter,
    barn,
    errorState,
    oppdaterUtgift,
    leggTilTomRadUnder,
    slettPeriode,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

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
                            />
                            <DateInput
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
                            <DateInput
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
                                        onClick={() => slettPeriode(indeks)}
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
