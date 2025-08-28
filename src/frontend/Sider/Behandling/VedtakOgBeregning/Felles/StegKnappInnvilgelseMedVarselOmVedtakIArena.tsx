import React from 'react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { StegKnapp } from '../../../../komponenter/Stegflyt/StegKnapp';
import { Behandling } from '../../../../typer/behandling/behandling';
import { BehandlingFakta } from '../../../../typer/behandling/behandlingFakta/behandlingFakta';
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
}: {
    vedtaksperioder: Periode[];
    lagreVedtak: () => Promise<RessursSuksess<unknown> | RessursFeilet>;
}) => {
    const { behandling, behandlingFakta } = useBehandling();

    const harVedtaksperioderFørVedtakIArena = finnHarVedtaksperioderFørVedtakIArena(
        behandling,
        behandlingFakta,
        vedtaksperioder
    );

    return (
        <StegKnapp
            steg={Steg.BEREGNE_YTELSE}
            nesteFane={FanePath.SIMULERING}
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
 * Dersom det er en revurdering så må man avkorte vedtaksperiodene fra og med revurder fra.
 */
const finnHarVedtaksperioderFørVedtakIArena = (
    behandling: Behandling,
    behandlingFakta: BehandlingFakta,
    vedtaksperioder: Periode[]
): boolean => {
    const arenaVedtakTom = nullableTilDato(behandlingFakta.arena?.vedtakTom);
    if (!arenaVedtakTom) {
        return false;
    }
    const førsteDagIVedtaksperiode = finnFørsteDagIVedtaksperiodeEtterRevurderFra(
        behandling.revurderFra,
        vedtaksperioder
    );
    return !!førsteDagIVedtaksperiode && førsteDagIVedtaksperiode <= arenaVedtakTom;
};

const finnFørsteDagIVedtaksperiodeEtterRevurderFra = (
    revurderFra: string | undefined,
    vedtaksperioder: Periode[]
): Date | undefined => {
    const revurderFraDate = nullableTilDato(revurderFra);

    const fraOgMedDatoer = vedtaksperioder
        .map((periode) => førsteGyldigeDatoForPeriode(periode, revurderFraDate))
        .filter((d): d is Date => !!d);

    return fraOgMedDatoer.length > 0
        ? fraOgMedDatoer.reduce((tidligst, dato) => (dato < tidligst ? dato : tidligst))
        : undefined;
};

/**
 * Finner første gyldige dato for periode.
 * Hvis man ikke har revurderFraDate, returneres fom.
 * Hvis revurderFraDate er etter tom, returneres undefined fordi vedtaksperioden ikke er aktuell i denne behandlingen
 * Hvis ikke så avkortes perioden til revurderFraDate.
 */
const førsteGyldigeDatoForPeriode = (
    periode: Periode,
    revurderFraDate: Date | undefined
): Date | undefined => {
    const fom = tilDato(periode.fom);
    const tom = tilDato(periode.tom);

    if (!revurderFraDate) {
        return fom;
    }

    if (tom < revurderFraDate) {
        return undefined;
    }

    return fom < revurderFraDate ? revurderFraDate : fom;
};
