import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import TextField from '../../../../../../komponenter/Skjema/TextField';
import { Utgift, UtgifterProperty } from '../../../../../../typer/vedtak';
import { harTallverdi, tilTallverdi } from '../../../../../../utils/tall';
import { Barn } from '../../../../vilkår';

const Grid = styled.div<{ $lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;
`;

interface Props {
    errorState: FormErrors<Utgift[]>;
    utgifter: Utgift[];
    barn: Barn;
    oppdaterUtgift: (utgiftIndeks: number, utgift: Utgift) => void;
}

const UtgifterValg: React.FC<Props> = ({ utgifter, barn, errorState, oppdaterUtgift }) => {
    const { behandlingErRedigerbar } = useBehandling();
    const oppdaterUtgiftFelt = (
        indeks: number,
        property: UtgifterProperty,
        value: string | string[] | number | boolean | undefined
    ) => {
        oppdaterUtgift(indeks, {
            ...utgifter[indeks],
            [property]: value,
        });
    };

    return (
        <>
            <Heading spacing size="xsmall" level="5">
                {barn.registergrunnlag.navn}
            </Heading>
            {utgifter && utgifter.length > 0 && (
                <Grid $lesevisning={!behandlingErRedigerbar}>
                    <Label>Månedlig utgift</Label>
                    <Label>Fra</Label>
                    <Label>Til</Label>

                    {utgifter.map((utgiftsperiode, indeks) => (
                        <React.Fragment key={indeks}>
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
                                        UtgifterProperty.utgift,
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
                                value={utgiftsperiode.fra}
                                onChange={(dato?: string) =>
                                    oppdaterUtgiftFelt(indeks, UtgifterProperty.fra, dato)
                                }
                                feil={errorState && errorState[indeks]?.fra}
                                size="small"
                            />
                            <DateInput
                                label="Til"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.til}
                                onChange={(dato?: string) =>
                                    oppdaterUtgiftFelt(indeks, UtgifterProperty.til, dato)
                                }
                                feil={errorState && errorState[indeks]?.til}
                                size="small"
                            />
                        </React.Fragment>
                    ))}
                </Grid>
            )}
        </>
    );
};

export default UtgifterValg;
