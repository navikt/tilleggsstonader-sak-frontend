import React from 'react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { BehandlingFakta } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { PeriodeStatus } from '../../../../typer/behandling/periodeStatus';
import { Steg } from '../../../../typer/behandling/steg';
import { RessursFeilet, RessursSuksess } from '../../../../typer/ressurs';
import { Vedtaksperiode } from '../../../../typer/vedtak/vedtakperiode';
import { nullableTilDato, tilDato } from '../../../../utils/dato';
import { Periode } from '../../../../utils/periode';
import { FanePath } from '../../faner';
import { utledStatus } from './vedtaksperioder/vedtaksperiodeUtils';

const bekreftelseModalPropsArena = {
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

const bekreftelseModalPropsPåvirkerTidligereVedtak = {
    tittel: 'Endring som påvirker tidligere vedtak',
    umamiId: 'endring-paavirker-tidligere-vedtak',
    tekst: 'Du gjør en endring som påvirker perioder i et tidligere vedtak. Er du sikker på at du vil fortsette?',
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

export const StegKnappInnvilgelseMedVarsel = ({
    lagreVedtak,
    vedtaksperioder,
    lagredeVedtaksperioder,
    vedtakErLagret,
    tidligsteEndring,
    steg = Steg.BEREGNE_YTELSE,
    nesteFane = FanePath.SIMULERING,
}: {
    vedtaksperioder: Vedtaksperiode[];
    lagredeVedtaksperioder: Map<string, Vedtaksperiode>;
    vedtakErLagret: boolean;
    lagreVedtak: () => Promise<RessursSuksess<unknown> | RessursFeilet>;
    tidligsteEndring: string | undefined;
    steg?: Steg;
    nesteFane?: FanePath;
}) => {
    const { behandlingFakta } = useBehandling();

    const harVedtaksperioderFørVedtakIArena = finnHarVedtaksperioderFørVedtakIArena(
        behandlingFakta,
        vedtaksperioder,
        tidligsteEndring
    );

    const påvirkerTidligerePerioder = skalVarsleOmEndringSomPåvirkerTidligerePerioder(
        vedtaksperioder,
        lagredeVedtaksperioder,
        vedtakErLagret,
        tidligsteEndring
    );

    const utledBekreftelseModalProps = () => {
        if (harVedtaksperioderFørVedtakIArena) {
            return bekreftelseModalPropsArena;
        }
        if (påvirkerTidligerePerioder) {
            return bekreftelseModalPropsPåvirkerTidligereVedtak;
        }
        return undefined;
    };

    return (
        <StegKnapp
            steg={steg}
            nesteFane={nesteFane}
            onNesteSteg={lagreVedtak}
            validerUlagedeKomponenter={false}
            bekreftelseModalProps={utledBekreftelseModalProps()}
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

/**
 * Returnerer true hvis tidligste endring er før tom-en i en uendret vedtaksperiode
 * eller før tom-en til vedtaksperiodeFraForrigeVedtak for en endret vedtaksperiode.
 */
const skalVarsleOmEndringSomPåvirkerTidligerePerioder = (
    vedtaksperioder: Vedtaksperiode[],
    lagredeVedtaksperioder: Map<string, Vedtaksperiode>,
    vedtakErLagret: boolean,
    tidligsteEndring: string | undefined
): boolean => {
    if (!tidligsteEndring) {
        return false;
    }

    const tidligsteEndringDato = tilDato(tidligsteEndring);

    return vedtaksperioder.some((vedtaksperiode) => {
        const lagretVedtaksperiode = lagredeVedtaksperioder.get(vedtaksperiode.id);
        const status = utledStatus(vedtaksperiode, vedtakErLagret, lagretVedtaksperiode);

        if (status === PeriodeStatus.UENDRET) {
            return tidligsteEndringDato < tilDato(vedtaksperiode.tom);
        }

        if (status === PeriodeStatus.ENDRET && vedtaksperiode.vedtaksperiodeFraForrigeVedtak) {
            return (
                tidligsteEndringDato < tilDato(vedtaksperiode.vedtaksperiodeFraForrigeVedtak.tom)
            );
        }

        return false;
    });
};
