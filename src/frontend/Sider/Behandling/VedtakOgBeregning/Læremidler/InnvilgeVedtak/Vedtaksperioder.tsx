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
import { lagTomVedtaksperiode, vedtaksperiodeRecordTilListe } from '../vedtakLæremidlerUtils';

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
    vedtaksperioder: { [k: string]: PeriodeMedEndretKey };
    settVedtaksperioder: React.Dispatch<React.SetStateAction<{ [k: string]: PeriodeMedEndretKey }>>;
    vedtaksperioderFeil?: { [k: string]: FormErrors<Periode> };
    settVedtaksperioderFeil: React.Dispatch<
        React.SetStateAction<{ [k: string]: FormErrors<Periode> } | undefined>
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
        key: string,
        property: 'fom' | 'tom',
        value: string | number | undefined
    ) => {
        settVedtaksperioder((prevState) => {
            const oppdatertPeriode = { ...prevState[key], [property]: value };
            return { ...prevState, [key]: oppdatertPeriode };
        });

        settVedtaksperioderFeil((prevState: { [k: string]: FormErrors<Periode> } = {}) => {
            const { [key]: _, ...remainingErrors } = prevState;
            return remainingErrors;
        });

        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const leggTilPeriode = () => {
        const tomVedtaksperiode = lagTomVedtaksperiode();
        settVedtaksperioder((prevState) => {
            return { ...prevState, [tomVedtaksperiode.endretKey]: tomVedtaksperiode };
        });
        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const slettPeriode = (key: string) => {
        settVedtaksperioder((prevState) => {
            const { [key]: _, ...gjennværendePerioder } = prevState;
            return gjennværendePerioder;
        });

        settVedtaksperioderFeil((prevState: { [k: string]: FormErrors<Periode> } = {}) => {
            const { [key]: _, ...remainingErrors } = prevState;
            return remainingErrors;
        });

        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const vedtaksperiodeListe = vedtaksperiodeRecordTilListe(vedtaksperioder);
    return (
        <VStack gap="4">
            <div>
                <Heading spacing size="xsmall" level="5">
                    Vedtaksperiode
                </Heading>
                <VedtaksperiodeReadMore />
            </div>
            {vedtaksperioder && vedtaksperiodeListe.length > 0 && (
                <Grid>
                    <Label size="small">Fra og med</Label>
                    <Label size="small">Til og med</Label>
                    {vedtaksperiodeListe.map((vedtaksperiode) => (
                        <React.Fragment key={vedtaksperiode.endretKey}>
                            <DateInputMedLeservisning
                                label="Fra"
                                hideLabel
                                erLesevisning={!erStegRedigerbart}
                                value={vedtaksperiode.fom}
                                onChange={(dato?: string) =>
                                    oppdaterPeriodeFelt(vedtaksperiode.endretKey, 'fom', dato)
                                }
                                feil={
                                    vedtaksperioderFeil &&
                                    vedtaksperioderFeil[vedtaksperiode.endretKey]?.fom
                                }
                                size="small"
                            />
                            <DateInputMedLeservisning
                                label="Til"
                                hideLabel
                                erLesevisning={!erStegRedigerbart}
                                value={vedtaksperiode.tom}
                                onChange={(dato?: string) =>
                                    oppdaterPeriodeFelt(vedtaksperiode.endretKey, 'tom', dato)
                                }
                                feil={
                                    vedtaksperioderFeil &&
                                    vedtaksperioderFeil[vedtaksperiode.endretKey]?.tom
                                }
                                size="small"
                            />
                            {erStegRedigerbart ? (
                                <Button
                                    variant="tertiary"
                                    onClick={() => slettPeriode(vedtaksperiode.endretKey)}
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
