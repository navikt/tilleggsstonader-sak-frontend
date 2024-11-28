import { EndreAktivitetFormBarnetilsyn } from './EndreAktivitetBarnetilsyn';
import { finnBegrunnelseGrunnerAktivitet } from './utilsBarnetilsyn';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { harIkkeVerdi } from '../../../../utils/utils';
import { Aktivitet, AktivitetType } from '../typer/vilkårperiode/aktivitet';

export interface AktivitetValidering extends Periode {
    type: AktivitetType | '';
    aktivitetsdager?: number;
    begrunnelse?: string;
}

export const validerAktivitet = (
    endretAktivitet: EndreAktivitetFormBarnetilsyn,
    lagretAktivitet?: Aktivitet | undefined,
    revurderesFraDato?: string
): FormErrors<AktivitetValidering> => {
    const feil: FormErrors<AktivitetValidering> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        aktivitetsdager: undefined,
        begrunnelse: undefined,
    };

    if (endretAktivitet.type === '') {
        return { ...feil, type: 'Må velges' };
    }

    const periodeValidering = validerPeriode(endretAktivitet, lagretAktivitet, revurderesFraDato);

    if (periodeValidering) {
        return {
            ...feil,
            ...periodeValidering,
        };
    }

    if (
        endretAktivitet.type !== AktivitetType.INGEN_AKTIVITET &&
        !aktivitetsdagerErGyldigTall(endretAktivitet.aktivitetsdager)
    ) {
        return { ...feil, aktivitetsdager: 'Aktivitetsdager må være et tall mellom 1 og 5' };
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunnerAktivitet(
        endretAktivitet.type,
        endretAktivitet.svarLønnet
    );

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretAktivitet.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};

const aktivitetsdagerErGyldigTall = (aktivitetsdager: number | undefined): boolean =>
    harTallverdi(aktivitetsdager) && aktivitetsdager >= 1 && aktivitetsdager <= 5;
