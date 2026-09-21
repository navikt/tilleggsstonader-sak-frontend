import { formaterIsoPeriode } from '../../../../../utils/dato';
import {
    AktivitetType,
    AktivitetTypeTilTekst,
} from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';

export interface AktivitetInfo {
    aktivitetId: string;
    aktivitetType: AktivitetType;
    tiltaksvariant?: string;
    fom: string;
    tom: string;
}

export const formatAktivitetInfo = (aktivitet: AktivitetInfo): string => {
    const aktivitetTypeTekst =
        AktivitetTypeTilTekst[aktivitet.aktivitetType] || aktivitet.aktivitetType;
    const label = aktivitet.tiltaksvariant || aktivitetTypeTekst;
    return `${label} (${formaterIsoPeriode(aktivitet.fom, aktivitet.tom)})`;
};
