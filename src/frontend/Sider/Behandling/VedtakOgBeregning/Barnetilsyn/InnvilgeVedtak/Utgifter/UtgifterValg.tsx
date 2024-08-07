import React, { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label } from '@navikt/ds-react';

import { useApp } from '../../../../../../context/AppContext';
import { useSteg } from '../../../../../../context/StegContext';
import { FormErrors } from '../../../../../../hooks/felles/useFormState';
import { UlagretKomponent } from '../../../../../../hooks/useUlagredeKomponenter';
import { SøppelbøtteKnapp } from '../../../../../../komponenter/Knapper/SøppelbøtteKnapp';
import MonthInputMedLeservisning from '../../../../../../komponenter/Skjema/MonthInputMedLeservisning';
import TextField from '../../../../../../komponenter/Skjema/TextField';
import { Utgift, UtgifterProperty } from '../../../../../../typer/vedtak';
import { BarnOppsummering } from '../../../../../../typer/vilkårsoppsummering';
import { tilÅrMåned } from '../../../../../../utils/dato';
import { harTallverdi, tilHeltall } from '../../../../../../utils/tall';
import { utledNavnFnrOgAlder } from '../../../../../../utils/tekstformatering';
import { fjernSpaces } from '../../../../../../utils/utils';
import { leggTilTomRadUnderIListe, tomUtgiftRad } from '../../utils';
import { InnvilgeVedtakForm } from '../InnvilgeBarnetilsyn';

const Grid = styled.div`
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
    barn: BarnOppsummering;
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
    const { settUlagretKomponent } = useApp();
    const { erStegRedigerbart } = useSteg();

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
        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const leggTilTomRadUnder = (utgiftIndex: number) => {
        oppdaterUtgiter(leggTilTomRadUnderIListe(utgifter, tomUtgiftRad(), utgiftIndex));
        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
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
        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    return (
        <div>
            <Heading spacing size="xsmall" level="5">
                {utledNavnFnrOgAlder(barn.navn, barn.ident, barn.alder)}
            </Heading>
            {utgifter && utgifter.length > 0 && (
                <Grid>
                    <Label size="small">Månedlig utgift</Label>
                    <Label size="small">Fra</Label>
                    <Label size="small">Til</Label>

                    {utgifter.map((utgiftsperiode, indeks) => (
                        <React.Fragment key={utgiftsperiode.endretKey}>
                            <TextField
                                erLesevisning={!erStegRedigerbart}
                                label="Utgifter"
                                hideLabel
                                value={
                                    harTallverdi(utgiftsperiode.utgift) ? utgiftsperiode.utgift : ''
                                }
                                onChange={(e) =>
                                    oppdaterUtgiftFelt(
                                        indeks,
                                        UtgifterProperty.UTGIFT,
                                        tilHeltall(fjernSpaces(e.target.value))
                                    )
                                }
                                error={errorState && errorState[indeks]?.utgift}
                                size="small"
                                autoComplete="off"
                            />
                            <MonthInputMedLeservisning
                                label="Fra"
                                hideLabel
                                erLesevisning={!erStegRedigerbart}
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
                            <MonthInputMedLeservisning
                                label="Til"
                                hideLabel
                                erLesevisning={!erStegRedigerbart}
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
                                {erStegRedigerbart && (
                                    <>
                                        <Button
                                            type="button"
                                            onClick={() => leggTilTomRadUnder(indeks)}
                                            variant="tertiary"
                                            icon={<PlusCircleIcon />}
                                            size="small"
                                        >
                                            Legg til utgift
                                        </Button>
                                        {indeks !== 0 && (
                                            <SøppelbøtteKnapp
                                                type="button"
                                                onClick={() => slettPeriode(barn.barnId, indeks)}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default UtgifterValg;
