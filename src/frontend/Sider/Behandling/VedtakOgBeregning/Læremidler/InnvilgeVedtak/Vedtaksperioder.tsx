import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, Label, ReadMore, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import { tomVedtaksperiode } from '../vedtakLæremidlerUtils';
import { VedtaksperiodeRad } from './VedtaksperiodeRad';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakLæremidler';
import { Toggle } from '../../../../../utils/toggles';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    grid-gap: 0.5rem 1.5rem;
    align-items: start;

    > :nth-child(5n) {
        grid-column: 1;
    }
`;

interface Props {
    vedtaksperioder: Vedtaksperiode[];
    lagredeVedtaksperioder: Map<string, Vedtaksperiode>;
    settVedtaksperioder: React.Dispatch<React.SetStateAction<Vedtaksperiode[]>>;
    vedtaksperioderFeil?: FormErrors<Vedtaksperiode>[];
    settVedtaksperioderFeil: React.Dispatch<
        React.SetStateAction<FormErrors<Vedtaksperiode>[] | undefined>
    >;
}

export const Vedtaksperioder: React.FC<Props> = ({
    vedtaksperioder,
    lagredeVedtaksperioder,
    settVedtaksperioder,
    vedtaksperioderFeil,
    settVedtaksperioderFeil,
}) => {
    const { erStegRedigerbart } = useSteg();
    const { settUlagretKomponent } = useApp();

    const [idNyeRader, settIdNyeRader] = useState<Set<string>>(new Set());
    const skalSetteMålgruppeOgAktivitet = useFlag(Toggle.LÆREMIDLER_VEDTAKSPERIODER_V2);

    const oppdaterPeriodeFelt = (
        indeks: number,
        property: 'fom' | 'tom' | 'målgruppeType' | 'aktivitetType',
        value: string | number | undefined
    ) => {
        settVedtaksperioder((prevState) => {
            const oppdatertPeriode = { ...prevState[indeks], [property]: value };

            return prevState.map((periode, i) => (i === indeks ? oppdatertPeriode : periode));
        });

        settVedtaksperioderFeil((prevState: FormErrors<Vedtaksperiode>[] | undefined) =>
            prevState?.filter((_, i) => i !== indeks)
        );

        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const leggTilPeriode = () => {
        const nyVedtaksperiode = tomVedtaksperiode();
        settIdNyeRader((prevState) => new Set([...prevState, nyVedtaksperiode.id]));
        settVedtaksperioder([...vedtaksperioder, nyVedtaksperiode]);
        settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
    };

    const slettPeriode = (indeks: number) => {
        const oppdatertePerioder = vedtaksperioder.filter((_, i) => i != indeks);
        settVedtaksperioder(oppdatertePerioder);

        settVedtaksperioderFeil((prevState: FormErrors<Vedtaksperiode>[] | undefined) =>
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
                    {skalSetteMålgruppeOgAktivitet ? (
                        <>
                            <Label size="small">Aktivitet</Label>
                            <Label size="small">Målgruppe</Label>
                        </>
                    ) : (
                        <>
                            <div />
                            <div />
                        </>
                    )}
                    {vedtaksperioder.map((vedtaksperiode, indeks) => (
                        <VedtaksperiodeRad
                            key={vedtaksperiode.id}
                            vedtaksperiode={vedtaksperiode}
                            lagretVedtaksperiode={lagredeVedtaksperioder.get(vedtaksperiode.id)}
                            erLesevisning={!erStegRedigerbart}
                            oppdaterPeriode={(property, value) => {
                                oppdaterPeriodeFelt(indeks, property, value);
                            }}
                            slettPeriode={() => slettPeriode(indeks)}
                            vedtaksperiodeFeil={vedtaksperioderFeil && vedtaksperioderFeil[indeks]}
                            erNyRad={idNyeRader.has(vedtaksperiode.id)}
                        />
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
