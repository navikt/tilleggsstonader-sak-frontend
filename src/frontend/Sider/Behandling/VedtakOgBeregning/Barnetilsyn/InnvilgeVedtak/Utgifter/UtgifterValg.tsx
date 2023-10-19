import React from 'react';

import styled from 'styled-components';

import { Heading, Label } from '@navikt/ds-react';

import { useBehandling } from '../../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import DateInput from '../../../../../../komponenter/Skjema/DateInput';
import TextField from '../../../../../../komponenter/Skjema/TextField';
import { Utgift } from '../../../../../../typer/vedtak';
import { harTallverdi } from '../../../../../../utils/tall';
import { Barn } from '../../../../vilkår';

const Grid = styled.div<{ $lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;
`;

interface Props {
    errorState: FormErrors<Utgift[]>;
    utgifter: Utgift[] | undefined;
    barn: Barn;
}

const UtgifterValg: React.FC<Props> = ({ utgifter, barn, errorState }) => {
    const { behandlingErRedigerbar } = useBehandling();

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
                                error={errorState && errorState[indeks]?.utgift}
                                size="small"
                            />
                            <DateInput
                                label="Fra"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.fra}
                                onChange={
                                    // eslint-disable-next-line no-console
                                    (dato?: string) => console.log(dato)
                                }
                                feil={errorState && errorState[indeks]?.fra}
                                size="small"
                            />
                            <DateInput
                                label="Til"
                                hideLabel
                                erLesevisning={!behandlingErRedigerbar}
                                value={utgiftsperiode.til}
                                onChange={
                                    // eslint-disable-next-line no-console
                                    (dato?: string) => console.log(dato)
                                    // oppdaterUtgiftsperiode(indeks, UtgifterProperty.til, dato)
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
