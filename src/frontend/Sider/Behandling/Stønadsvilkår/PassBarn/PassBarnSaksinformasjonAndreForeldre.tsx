import React from 'react';

import { Alert, VStack } from '@navikt/ds-react';

import styles from './PassBarnSaksinformasjonAndreForeldre.module.css';
import { SaksinformasjonAndreForeldre } from '../../../../typer/behandling/behandlingFakta/faktaBarn';
import { formaterIsoDatoTidKort, formaterIsoPeriode } from '../../../../utils/dato';

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
        <VStack gap={'space-8'}>
            {harBehandlingUnderArbeid && (
                <Alert className={styles.maxWidth} variant={'warning'} size={'small'}>
                    Annen forelder har behandling under arbeid
                    {sjekketTidspunkt(hentetTidspunkt)}
                </Alert>
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
            <Alert className={styles.maxWidth} variant={'info'} size={'small'} inline>
                Det utbetales ikke støtte til pass av barn til annen forelder for dette barnet
                {sjekketTidspunkt(hentetTidspunkt)}
            </Alert>
        );
    }
    return (
        <Alert
            className={styles.maxWidth}
            variant={'warning'}
            size={'small'}
            contentMaxWidth={false}
        >
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
        </Alert>
    );
};
