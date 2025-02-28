import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { datoErIPeriodeInklusivSlutt, erDatoEtterEllerLik } from '../../../../utils/dato';
import { AktivitetType, AktivitetTypeTilTekst } from '../typer/vilkårperiode/aktivitet';

export const aktivitetTypeTilTekst = (type: AktivitetType | '') => {
    if (type === '') return type;

    return AktivitetTypeTilTekst[type];
};

export const valgbareAktivitetTyper = (stønadstype: Stønadstype): SelectOption[] => {
    const relevanteTyper = finnRelevanteAktivitetTyperForStønad(stønadstype);

    return relevanteTyper.map((type) => ({
        value: type,
        label: AktivitetTypeTilTekst[type],
    }));
};

export const valgbareAktivitetTyperForStønadsperiode = (stønadstype: Stønadstype) =>
    valgbareAktivitetTyper(stønadstype).filter(
        (option) => option.value !== AktivitetType.INGEN_AKTIVITET
    );

export const finnRelevanteAktivitetTyperForStønad = (stønadstype: Stønadstype): AktivitetType[] => {
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return [
                AktivitetType.TILTAK,
                AktivitetType.UTDANNING,
                AktivitetType.REELL_ARBEIDSSØKER,
                AktivitetType.INGEN_AKTIVITET,
            ];

        case Stønadstype.LÆREMIDLER:
            return [AktivitetType.TILTAK, AktivitetType.UTDANNING, AktivitetType.INGEN_AKTIVITET];

        case Stønadstype.BOUTGIFTER:
            return [AktivitetType.TILTAK, AktivitetType.UTDANNING, AktivitetType.INGEN_AKTIVITET];
    }
};

/**
 * En aktivitet kan alltid brukes i en førstegangsbehandling
 * Hvis det er en revurdering kan den kun brukes dersom det revurderes eller eller i aktivitetens periode
 * OBS: Man vil ikke kunne lagre den brukte aktiviteten som en vilkårperiode uten å endre fom-datoen til minst revurder fra.
 */
export const kanRegisterAktivitetBrukes = (aktivitet: Registeraktivitet, revurderFra?: string) => {
    if (!revurderFra) return true;
    if (!aktivitet.fom) return false;

    return (
        erDatoEtterEllerLik(revurderFra, aktivitet.fom) ||
        (aktivitet.tom && datoErIPeriodeInklusivSlutt(revurderFra, aktivitet.fom, aktivitet.tom))
    );
};
