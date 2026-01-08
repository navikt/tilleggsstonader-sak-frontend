import React from 'react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { BehandlingFakta } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Steg } from '../../../../typer/behandling/steg';
import { RessursFeilet, RessursSuksess } from '../../../../typer/ressurs';
import { nullableTilDato, tilDato } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { FanePath } from '../../faner';

const bekreftelseModalProps = {
    tittel: 'Vedtak i Arena i samme periode',
    umamiId: 'vedtak-i-arena-samme-periode',
    tekst: 'Er du sikker på at det er riktig at det skal være innvilgelse for samme periode som det er innvilget i Arena?',
    hovedKnapp: {
        tekst: 'Angre og endre vedtaksperiode',
        skalTriggeGåTilNesteSteg: false,
    },
    sekundærKnapp: {
        tekst: 'Lagre og gå videre',
        skalTriggeGåTilNesteSteg: true,
    },
    lukkKnapp: {
        tekst: 'Avbryt',
    },
};

export const StegKnappInnvilgelseMedVarselOmVedtakIArena = ({
    lagreVedtak,
    vedtaksperioder,
    tidligsteEndring,
}: {
    vedtaksperioder: Periode[];
    lagreVedtak: () => Promise<RessursSuksess<unknown> | RessursFeilet>;
    tidligsteEndring: string | undefined;
}) => {
    const { behandling, behandlingFakta } = useBehandling();

    const harVedtaksperioderFørVedtakIArena = finnHarVedtaksperioderFørVedtakIArena(
        behandlingFakta,
        vedtaksperioder,
        tidligsteEndring
    );

    const steg =
        behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSO ||
        behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSR
            ? Steg.VEDTAK
            : Steg.BEREGNE_YTELSE;

    const nesteFane =
        behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSO ||
        behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSR
            ? FanePath.KJØRELISTE
            : FanePath.SIMULERING;

    return (
        <StegKnapp
            steg={steg}
            nesteFane={nesteFane}
            onNesteSteg={lagreVedtak}
            validerUlagedeKomponenter={false}
            bekreftelseModalProps={
                harVedtaksperioderFørVedtakIArena ? bekreftelseModalProps : undefined
            }
        >
            Lagre vedtak og gå videre
        </StegKnapp>
    );
};

/**
 * Finnes ut om man har vedtaksperiode før vedtak i Arena.
 * Dersom det er en revurdering så må man avkorte vedtaksperiodene fra og med tidligste endring.
 */
const finnHarVedtaksperioderFørVedtakIArena = (
    behandlingFakta: BehandlingFakta,
    vedtaksperioder: Periode[],
    tidligsteEndring: string | undefined
): boolean => {
    const arenaVedtakTom = nullableTilDato(behandlingFakta.arena?.vedtakTom);
    if (!arenaVedtakTom) {
        return false;
    }
    const førsteDagIVedtaksperiode = finnFørsteDagIVedtaksperiodeEtterTidligsteEndring(
        tidligsteEndring,
        vedtaksperioder
    );
    return !!førsteDagIVedtaksperiode && førsteDagIVedtaksperiode <= arenaVedtakTom;
};

const finnFørsteDagIVedtaksperiodeEtterTidligsteEndring = (
    tidligsteEndring: string | undefined,
    vedtaksperioder: Periode[]
): Date | undefined => {
    const tidligsteEndringDate = nullableTilDato(tidligsteEndring);

    const fraOgMedDatoer = vedtaksperioder
        .map((periode) => førsteGyldigeDatoForPeriode(periode, tidligsteEndringDate))
        .filter((d): d is Date => !!d);

    return fraOgMedDatoer.length > 0
        ? fraOgMedDatoer.reduce((tidligst, dato) => (dato < tidligst ? dato : tidligst))
        : undefined;
};

/**
 * Finner første gyldige dato for periode.
 * Hvis man ikke har tidligsteEndringDate, returneres fom.
 * Hvis tidligsteEndringDate er etter tom, returneres undefined fordi vedtaksperioden ikke er aktuell i denne behandlingen
 * Hvis ikke så avkortes perioden til tidligsteEndringDate.
 */
const førsteGyldigeDatoForPeriode = (
    periode: Periode,
    tidligsteEndringDate: Date | undefined
): Date | undefined => {
    const fom = tilDato(periode.fom);
    const tom = tilDato(periode.tom);

    if (!tidligsteEndringDate) {
        return fom;
    }

    if (tom < tidligsteEndringDate) {
        return undefined;
    }

    return fom < tidligsteEndringDate ? tidligsteEndringDate : fom;
};
