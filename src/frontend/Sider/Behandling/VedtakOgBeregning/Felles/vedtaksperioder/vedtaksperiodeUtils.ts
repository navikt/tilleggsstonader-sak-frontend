import { v4 as uuidv4 } from 'uuid';

import { SelectOption } from '../../../../../komponenter/Skjema/SelectMedOptions';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { PeriodeStatus } from '../../../../../typer/behandling/periodeStatus';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    FaktiskMålgruppeTilTekst,
    faktiskeMålgrupperForStønad,
} from '../../../Felles/faktiskMålgruppe';

export const initialiserVedtaksperioder = (
    vedtaksperioder: Vedtaksperiode[] | undefined
): Vedtaksperiode[] => {
    return vedtaksperioder?.length ? vedtaksperioder : [];
};

export const tomVedtaksperiode = (): Vedtaksperiode => ({
    fom: '',
    tom: '',
    målgruppeType: '',
    aktivitetType: '',
    id: uuidv4(),
});

export const utledStatus = (
    vedtaksperiode: Vedtaksperiode,
    vedtakErLagret: boolean,
    lagretVedtaksperiode: Vedtaksperiode | undefined
): PeriodeStatus => {
    // Hvis vedtak ikke er lagret på behandling, hentes vedtaksperiode fra forrige behandling
    // og vedtaksperiode.forrigeVedtaksperiode er forrige-forrige vedtaksperiode
    const vedtaksperiodeFraForrigeVedtak = vedtakErLagret
        ? vedtaksperiode.vedtaksperiodeFraForrigeVedtak
        : lagretVedtaksperiode;

    if (!vedtaksperiodeFraForrigeVedtak) {
        return PeriodeStatus.NY;
    }

    if (
        vedtaksperiode.fom === vedtaksperiodeFraForrigeVedtak.fom &&
        vedtaksperiode.tom === vedtaksperiodeFraForrigeVedtak.tom &&
        (vedtaksperiode.aktivitetType || '') ===
            (vedtaksperiodeFraForrigeVedtak.aktivitetType || '') &&
        vedtaksperiode.målgruppeType === vedtaksperiodeFraForrigeVedtak.målgruppeType
    ) {
        return PeriodeStatus.UENDRET;
    }

    return PeriodeStatus.ENDRET;
};

// Brukes for å kun få relevante valg for faktisk målgruppe når man lager vedtaksperioder
export const finnFaktiskeMålgruppeValgForStønad = (stønadstype: Stønadstype): SelectOption[] => {
    const relevateFaktiskeMålgrupper = faktiskeMålgrupperForStønad[stønadstype];

    return relevateFaktiskeMålgrupper.map((faktiskMålgruppe) => ({
        value: faktiskMålgruppe,
        label: FaktiskMålgruppeTilTekst[faktiskMålgruppe],
    }));
};

/**
 * Vedtaksperiode der aktivitet ikke sendes til backend:
 * - TSR-varianter: backend setter aktivitet automatisk, siden typeandel bestemmes ut fra tiltaksvariant.
 * - Flytting: vedtaksperioden har ikke aktivitet.
 */
export type VedtaksperiodeUtenAktivitetDto = Omit<Vedtaksperiode, 'aktivitetType'>;

const stønadstyperUtenAktivitetIVedtaksperiode = [
    Stønadstype.DAGLIG_REISE_TSR,
    Stønadstype.REISE_TIL_SAMLING_TSR,
    Stønadstype.FLYTTING_TSO,
    Stønadstype.FLYTTING_TSR,
];

export const tilVedtaksperioderDto = (
    perioder: Vedtaksperiode[],
    stønadstype: Stønadstype
): Vedtaksperiode[] | VedtaksperiodeUtenAktivitetDto[] => {
    if (stønadstyperUtenAktivitetIVedtaksperiode.includes(stønadstype)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return perioder.map(({ aktivitetType, ...rest }) => rest);
    }
    return perioder;
};
