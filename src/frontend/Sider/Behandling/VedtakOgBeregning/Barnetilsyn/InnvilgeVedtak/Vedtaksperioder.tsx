import React, { useState } from 'react';

import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HStack, Label, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../../context/AppContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import { VedtaksperiodeTilsynBarn } from '../../../../../typer/vedtak/vedtakTilsynBarn';
import { tomVedtaksperiode } from '../VedtakBarnetilsynUtils';
import { VedtaksperiodeRad } from './VedtaksperiodeRad';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { RessursStatus } from '../../../../../typer/ressurs';

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
    foreslåPeriodeFeil?: string;
    settForeslåPeriodeFeil: React.Dispatch<string | undefined>;
}

export const Vedtaksperioder: React.FC<Props> = ({
    vedtaksperioder,
    settVedtaksperioder,
    vedtaksperioderFeil,
    settVedtaksperioderFeil,
    foreslåPeriodeFeil,
    settForeslåPeriodeFeil,
}) => {
    const { erStegRedigerbart } = useSteg();
    const { request, settUlagretKomponent } = useApp();
    const { behandling } = useBehandling();

    const [idNyeRader, settIdNyeRader] = useState<Set<string>>(new Set());

    const oppdaterPeriodeFelt = (
        indeks: number,
        property: 'fom' | 'tom' | 'målgruppeType' | 'aktivitetType',
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

    const foreslåVedtaksperioder = () => {
        request<VedtaksperiodeTilsynBarn[], null>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}/foresla`,
            'GET'
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                const perioder = res.data.map((periode) => ({
                    ...periode,
                    id: uuid(),
                }));
                settVedtaksperioder(perioder);
                settForeslåPeriodeFeil(undefined);
            } else {
                settForeslåPeriodeFeil(res.frontendFeilmelding);
            }
        });
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
                <>
                    <HStack gap={'2'}>
                        <Button
                            size="small"
                            onClick={leggTilPeriode}
                            style={{ maxWidth: 'fit-content' }}
                            variant="secondary"
                            icon={<PlusCircleIcon />}
                        >
                            Legg til vedtaksperiode
                        </Button>
                        <Button
                            size="small"
                            onClick={foreslåVedtaksperioder}
                            style={{ maxWidth: 'fit-content' }}
                            variant="tertiary"
                        >
                            Foreslå vedtaksperioder
                        </Button>
                    </HStack>
                    {foreslåPeriodeFeil && (
                        <Alert variant="error" title="Klarte ikke å preutfylle periode">
                            {foreslåPeriodeFeil}
                        </Alert>
                    )}
                </>
            )}
        </VStack>
    );
};
