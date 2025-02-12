import React, { useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import { VedtaksperiodeTilsynBarn } from '../../../../../typer/vedtak/vedtakTilsynBarn';
import { tomVedtaksperiode } from '../VedtakBarnetilsynUtils';
import { VedtaksperiodeRad } from './VedtaksperiodeRad';

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
    vedtaksperioder: VedtaksperiodeTilsynBarn[];
    settVedtaksperioder: React.Dispatch<React.SetStateAction<VedtaksperiodeTilsynBarn[]>>;
    vedtaksperioderFeil?: FormErrors<VedtaksperiodeTilsynBarn>[];
    settVedtaksperioderFeil: React.Dispatch<
        React.SetStateAction<FormErrors<VedtaksperiodeTilsynBarn>[] | undefined>
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

    const [idNyeRader, settIdNyeRader] = useState<Set<string>>(new Set());

    const oppdaterPeriodeFelt = (
        indeks: number,
        property: 'fom' | 'tom' | 'målgruppe' | 'aktivitet',
        value: string | number | undefined
    ) => {
        settVedtaksperioder((prevState) => {
            const oppdatertPeriode = { ...prevState[indeks], [property]: value };

            return prevState.map((periode, i) => (i === indeks ? oppdatertPeriode : periode));
        });

        settVedtaksperioderFeil((prevState: FormErrors<VedtaksperiodeTilsynBarn>[] | undefined) =>
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

        settVedtaksperioderFeil((prevState: FormErrors<VedtaksperiodeTilsynBarn>[] | undefined) =>
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
            </div>
            {vedtaksperioder && vedtaksperioder.length > 0 && (
                <Grid>
                    <Label size="small">Fra og med</Label>
                    <Label size="small">Til og med</Label>
                    <Label size="small">Aktivitet</Label>
                    <Label size="small">Målgruppe</Label>
                    {vedtaksperioder.map((vedtaksperiode, indeks) => (
                        <VedtaksperiodeRad
                            key={vedtaksperiode.id}
                            vedtaksperiode={vedtaksperiode}
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
