import React from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label, ReadMore, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { PeriodeMedEndretKey } from '../../../../../utils/periode';
import { tomVedtaksperiode } from '../vedtakLæremidlerUtils';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: center;
    > :nth-child(3n) {
        grid-column: 1;
    }
`;

interface Props {
    vedtaksperioder: PeriodeMedEndretKey[];
    settVedtaksperioder: React.Dispatch<React.SetStateAction<PeriodeMedEndretKey[]>>;
}

export const Vedtaksperioder: React.FC<Props> = ({ vedtaksperioder, settVedtaksperioder }) => {
    const { erStegRedigerbart } = useSteg();
    const { settUlagretKomponent } = useApp();

    const oppdaterPeriodeFelt = (
        indeks: number,
        property: 'fom' | 'tom',
        value: string | number | undefined
    ) => {
        settVedtaksperioder((prevState) => {
            const oppdatertPeriode = { ...prevState[indeks], [property]: value };

            return prevState.map((periode, i) => (i === indeks ? oppdatertPeriode : periode));
        });

        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const leggTilPeriode = () => {
        settVedtaksperioder([...vedtaksperioder, tomVedtaksperiode()]);
        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const slettPeriode = (indeks: number) => {
        const oppdatertePerioder = vedtaksperioder.filter((_, i) => i != indeks);
        settVedtaksperioder(oppdatertePerioder);
        // settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
        //     const utgiftsperioder = (
        //         (prevState.utgifter && prevState.utgifter[barnId]) ??
        //         []
        //     ).splice(utgiftIndex, 1);
        //     return { ...prevState, utgiftsperioder };
        // });
        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    return (
        <VStack gap="4">
            <div>
                <Heading spacing size="xsmall" level="5">
                    Vedtaksperiode
                </Heading>
                <VedtaksperiodeReadMore />
            </div>
            {vedtaksperioder && vedtaksperioder.length > 0 && (
                <Grid>
                    <Label size="small">Fra og med</Label>
                    <Label size="small">Til og med</Label>
                    {vedtaksperioder.map((vedtaksperiode, indeks) => (
                        <React.Fragment key={vedtaksperiode.endretKey}>
                            <DateInputMedLeservisning
                                label="Fra"
                                hideLabel
                                erLesevisning={!erStegRedigerbart}
                                value={vedtaksperiode.fom}
                                onChange={(dato?: string) =>
                                    oppdaterPeriodeFelt(indeks, 'fom', dato)
                                }
                                // feil={errorState && errorState[indeks]?.fom}
                                size="small"
                            />
                            <DateInputMedLeservisning
                                label="Til"
                                hideLabel
                                erLesevisning={!erStegRedigerbart}
                                value={vedtaksperiode.tom}
                                onChange={(dato?: string) =>
                                    oppdaterPeriodeFelt(indeks, 'tom', dato)
                                }
                                // feil={errorState && errorState[indeks]?.tom}
                                size="small"
                            />
                            {erStegRedigerbart && (
                                <Button
                                    variant="tertiary"
                                    onClick={() => slettPeriode(indeks)}
                                    icon={<TrashIcon />}
                                    size="xsmall"
                                />
                            )}
                        </React.Fragment>
                    ))}
                </Grid>
            )}
            {erStegRedigerbart && (
                <Button
                    size="small"
                    onClick={leggTilPeriode}
                    style={{ maxWidth: 'fit-content' }}
                    variant="secondary"
                    icon={<PlusCircleIcon />}
                >
                    Legg til vedtaksperiode
                </Button>
            )}
        </VStack>
    );
};

const VedtaksperiodeReadMore = () => (
    <ReadMore header="Slik setter du vedtaksperioden" size="small">
        Fyll ut...
    </ReadMore>
);
