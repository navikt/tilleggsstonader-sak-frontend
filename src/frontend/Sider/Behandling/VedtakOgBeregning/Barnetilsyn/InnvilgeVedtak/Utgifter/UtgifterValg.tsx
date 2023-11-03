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
import { tomUtgiftRad, UtgifterPerBarn } from '../../utils';

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
    errorState: FormErrors<UtgifterPerBarn>;
    utgifterPerBarn: UtgifterPerBarn;
    barn: GrunnlagBarn;
    oppdaterUtgift: (utgifterPerBarn: UtgifterPerBarn) => void;
}

const UtgifterValg: React.FC<Props> = ({ utgifterPerBarn, barn, errorState, oppdaterUtgift }) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { utgifter } = utgifterPerBarn;

    const oppdaterUtgiftFelt = (
        utgift: Utgift,
        property: UtgifterProperty,
        value: string | number | undefined
    ) => {
        return {
            ...utgift,
            [property]: value,
        };
    };
    const oppdaterUtgiftVerdi = (
        indeks: number,
        property: UtgifterProperty,
        value: string | number | undefined
    ) => {
        const oppdaterteUtgifter = utgifter.map((utgift, i) =>
            i === indeks ? oppdaterUtgiftFelt(utgift, property, value) : utgift
        );
        oppdaterUtgift({
            ...utgifterPerBarn,
            utgifter: oppdaterteUtgifter,
        });
    };

    const slettPeriode = (utgiftIndex: number) => {
        oppdaterUtgift({
            ...utgifterPerBarn,
            utgifter: utgifter.filter((_, i) => i !== utgiftIndex),
        });
    };

    function leggTilTomRad(indeks: number) {
        oppdaterUtgift({
            barnId: utgifterPerBarn.barnId,
            utgifter: [
                ...utgifterPerBarn.utgifter.slice(0, indeks + 1),
                tomUtgiftRad(),
                ...utgifterPerBarn.utgifter.slice(indeks + 1, utgifterPerBarn.utgifter.length),
            ],
        });
    }

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
                        // TODO: Skal ikke bruke indeks som key
                        <React.Fragment key={utgiftsperiode.endretKey}>
                            <TextField
                                erLesevisning={!behandlingErRedigerbar}
                                label="Utgifter"
                                hideLabel
                                value={
                                    harTallverdi(utgiftsperiode.utgift) ? utgiftsperiode.utgift : ''
                                }
                                onChange={(e) =>
                                    oppdaterUtgiftVerdi(
                                        indeks,
                                        UtgifterProperty.UTGIFT,
                                        tilTallverdi(e.target.value)
                                    )
                                }
                                error={errorState && errorState.utgifter[indeks]?.utgift}
                                size="small"
                            />
                            <DateInput
                                label="Fra"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.fom}
                                onChange={(dato?: string) =>
                                    oppdaterUtgiftVerdi(
                                        indeks,
                                        UtgifterProperty.FOM,
                                        dato ? tilÅrMåned(new Date(dato)) : undefined
                                    )
                                }
                                feil={errorState && errorState.utgifter[indeks]?.fom}
                                size="small"
                            />
                            <DateInput
                                label="Til"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.tom}
                                onChange={(dato?: string) =>
                                    oppdaterUtgiftVerdi(
                                        indeks,
                                        UtgifterProperty.TOM,
                                        dato ? tilÅrMåned(new Date(dato)) : undefined
                                    )
                                }
                                feil={errorState && errorState.utgifter[indeks]?.tom}
                                size="small"
                            />
                            <div>
                                <Button
                                    type="button"
                                    onClick={() => leggTilTomRad(indeks)}
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
