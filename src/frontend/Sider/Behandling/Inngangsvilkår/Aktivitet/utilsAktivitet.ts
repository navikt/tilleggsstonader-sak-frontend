import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { Aktivitet, AktivitetType, AktivitetTypeTilTekst } from '../typer/vilkårperiode/aktivitet';

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

export const valgbareAktivitetTyperForVedtaksperiode = (stønadstype: Stønadstype) =>
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

        case Stønadstype.DAGLIG_REISE_TSR:
            return [AktivitetType.TILTAK, AktivitetType.INGEN_AKTIVITET];

        case Stønadstype.DAGLIG_REISE_TSO:
            return [AktivitetType.TILTAK, AktivitetType.UTDANNING, AktivitetType.INGEN_AKTIVITET];
    }
};

export const erRegisterAktivitetBrukt = (
    aktiviteter: Aktivitet[],
    registerAktivitet: Registeraktivitet
) => aktiviteter.some((aktivitet) => registerAktivitet.id === aktivitet.kildeId);
