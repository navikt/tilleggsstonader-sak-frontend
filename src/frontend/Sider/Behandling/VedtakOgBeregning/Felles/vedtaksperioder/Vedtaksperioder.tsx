import React, { useState } from 'react';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, Label, VStack } from '@navikt/ds-react';

import { VedtaksperiodeRad } from './VedtaksperiodeRad';
import { VedtaksperiodeReadMore } from './VedtaksperioderReadMore';
import { tomVedtaksperiode } from './vedtaksperiodeUtils';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { UlagretKomponent } from '../../../../../hooks/useUlagredeKomponenter';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import {
    Feil,
    feiletRessursTilFeilmelding,
} from '../../../../../komponenter/Feil/feilmeldingUtils';
import { RessursStatus } from '../../../../../typer/ressurs';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { stønadstypeTilVedtakUrl } from '../stønadstypeTilVedtakUrl';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, max-content);
    grid-gap: 0.5rem 1.5rem;
    align-items: start;

    > :nth-child(5) {
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
    foreslåPeriodeFeil?: Feil;
    settForeslåPeriodeFeil: React.Dispatch<Feil | undefined>;
}

export const Vedtaksperioder: React.FC<Props> = ({
    vedtaksperioder,
    lagredeVedtaksperioder,
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
    /**
     * Må trigge rendering av komponent når vi foreslår nye vedtaksperioder
     * fordi DateInput ikke bli rerendret pga hook og har samme key
     */
    const [vedtaksperioderId, settVedtaksperioderId] = useState<string>(uuidv4());

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

    const foreslåVedtaksperioder = () => {
        request<Vedtaksperiode[], null>(
            `/api/sak/vedtak/${stønadstypeTilVedtakUrl[behandling.stønadstype]}/${behandling.id}/foresla`,
            'GET'
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVedtaksperioder(res.data);
                settVedtaksperioderId(uuidv4());
                settForeslåPeriodeFeil(undefined);
                settUlagretKomponent(UlagretKomponent.BEREGNING_INNVILGE);
            } else {
                settForeslåPeriodeFeil(feiletRessursTilFeilmelding(res));
            }
        });
    };

    return (
        <VStack gap="4">
            <div>
                <Heading spacing size="xsmall" level="5">
                    Vedtaksperiode
                </Heading>
                <VedtaksperiodeReadMore stønadstype={behandling.stønadstype} />
            </div>
            {vedtaksperioder && vedtaksperioder.length > 0 && (
                <Grid key={vedtaksperioderId}>
                    <Label size="small">Fra og med</Label>
                    <Label size="small">Til og med</Label>
                    <Label size="small">Aktivitet</Label>
                    <Label size="small">Målgruppe</Label>
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
                <>
                    <HStack gap={'2'}>
                        <Button
                            size="small"
                            onClick={foreslåVedtaksperioder}
                            style={{ maxWidth: 'fit-content' }}
                            variant="primary"
                        >
                            Få forslag til vedtaksperioder
                        </Button>
                        <Button
                            size="small"
                            onClick={leggTilPeriode}
                            style={{ maxWidth: 'fit-content' }}
                            variant="tertiary"
                            icon={<PlusCircleIcon />}
                        >
                            Legg til periode manuelt
                        </Button>
                    </HStack>
                    {foreslåPeriodeFeil && <Feilmelding feil={foreslåPeriodeFeil} />}
                </>
            )}
        </VStack>
    );
};
