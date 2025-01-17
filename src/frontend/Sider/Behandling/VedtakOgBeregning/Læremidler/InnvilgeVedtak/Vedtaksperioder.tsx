import React from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, Label, ReadMore, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { Periode, PeriodeMedEndretKey } from '../../../../../utils/periode';
import { tomVedtaksperiode } from '../vedtakLæremidlerUtils';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;
    > :nth-child(3n) {
        grid-column: 1;
    }
`;

interface Props {
    vedtaksperioder: PeriodeMedEndretKey[];
    settVedtaksperioder: React.Dispatch<React.SetStateAction<PeriodeMedEndretKey[]>>;
    vedtaksperioderFeil?: FormErrors<Periode>[];
    settVedtaksperioderFeil: React.Dispatch<
        React.SetStateAction<FormErrors<Periode>[] | undefined>
    >;
}

export const Vedtaksperioder: React.FC<Props> = ({
    vedtaksperioder,
    settVedtaksperioder,
    vedtaksperioderFeil,
    settVedtaksperioderFeil,
}) => {
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

        settVedtaksperioderFeil((prevState: FormErrors<Periode>[] | undefined) =>
            prevState?.filter((_, i) => i !== indeks)
        );

        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const leggTilPeriode = () => {
        settVedtaksperioder([...vedtaksperioder, tomVedtaksperiode()]);
        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const slettPeriode = (indeks: number) => {
        const oppdatertePerioder = vedtaksperioder.filter((_, i) => i != indeks);
        settVedtaksperioder(oppdatertePerioder);

        settVedtaksperioderFeil((prevState: FormErrors<Periode>[] | undefined) =>
            prevState?.filter((_, i) => i !== indeks)
        );

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
                                feil={vedtaksperioderFeil && vedtaksperioderFeil[indeks]?.fom}
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
                                feil={vedtaksperioderFeil && vedtaksperioderFeil[indeks]?.tom}
                                size="small"
                            />
                            {erStegRedigerbart ? (
                                <Button
                                    variant="tertiary"
                                    onClick={() => slettPeriode(indeks)}
                                    icon={<TrashIcon />}
                                    size="xsmall"
                                />
                            ) : (
                                <div />
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
        <BodyLong size={'small'}>
            Vedtaksperioden kan maks være 11 måneder per år. Hvis søker har utdanning som feks går
            fra januar - desember og skal ha vedtaksperiode på 10 måneder, må det settes to
            vedtaksperioder, en fra 1. januar - 30. juni og en fra 1. august - 31. desember som
            tilsammen blir 10 måneder. Hvis vedtaksperioden går over årsskiftet, f.eks. fra 1.
            august - 31. mai, trenger du ikke dele dette opp i to perioder.
        </BodyLong>
    </ReadMore>
);
