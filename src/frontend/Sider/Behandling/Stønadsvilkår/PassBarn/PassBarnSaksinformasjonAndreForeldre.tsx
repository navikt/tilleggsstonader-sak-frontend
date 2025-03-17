import React from 'react';

import { styled } from 'styled-components';

import { Alert, VStack } from '@navikt/ds-react';

import { SaksinformasjonAndreForeldre } from '../../../../typer/behandling/behandlingFakta/faktaBarn';
import { formaterIsoDatoTidKort, formaterIsoPeriode } from '../../../../utils/dato';

const StyledAlert = styled(Alert)`
    max-width: 50rem;
`;

const sjekketTidspunkt = (hentetTidspunkt: string) =>
    ` (sjekket ${formaterIsoDatoTidKort(hentetTidspunkt)})`;

export const PassBarnSaksinformasjonAndreForeldre = ({
    saksinformasjonAndreForeldre,
}: {
    saksinformasjonAndreForeldre: SaksinformasjonAndreForeldre | undefined;
}) => {
    // Tidligere behandlinger har ikke informasjonen
    if (!saksinformasjonAndreForeldre) {
        return null;
    }
    const { hentetTidspunkt, harBehandlingUnderArbeid } = saksinformasjonAndreForeldre;
    return (
        <VStack gap={'2'}>
            {harBehandlingUnderArbeid && (
                <StyledAlert variant={'warning'} size={'small'}>
                    Annen forelder har behandling under arbeid
                    {sjekketTidspunkt(hentetTidspunkt)}
                </StyledAlert>
            )}
            <AlertVedtaksperioder saksinformasjonAndreForeldre={saksinformasjonAndreForeldre} />
        </VStack>
    );
};

/**
 * Hvis ingen vedtaksperiode: Utbetales ikke tilsyn barn
 * Hvis en vedtaksperiode: Periode vises rett etter tekst
 * Hvis flere: Perioder vises under tekst
 */
const AlertVedtaksperioder = ({
    saksinformasjonAndreForeldre,
}: {
    saksinformasjonAndreForeldre: SaksinformasjonAndreForeldre;
}) => {
    const { hentetTidspunkt, vedtaksperioderBarn } = saksinformasjonAndreForeldre;
    if (vedtaksperioderBarn.length === 0) {
        return (
            <StyledAlert variant={'info'} size={'small'} inline>
                Det utbetales ikke støtte til pass av barn til annen forelder for dette barnet
                {sjekketTidspunkt(hentetTidspunkt)}
            </StyledAlert>
        );
    }
    return (
        <StyledAlert variant={'warning'} size={'small'} contentMaxWidth={false}>
            <VStack>
                <span>
                    Det utbetales tilsyn barn til annen forelder for dette barnet{' '}
                    {vedtaksperioderBarn.length === 1 &&
                        formaterIsoPeriode(vedtaksperioderBarn[0].fom, vedtaksperioderBarn[0].tom)}
                    {sjekketTidspunkt(hentetTidspunkt)}
                </span>
                {vedtaksperioderBarn.length > 1 &&
                    vedtaksperioderBarn.map((periode, index) => (
                        <span key={index}>{formaterIsoPeriode(periode.fom, periode.tom)}</span>
                    ))}
            </VStack>
        </StyledAlert>
    );
};
