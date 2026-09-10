import { EndreAktivitetFormDagligReiseTso } from './EndreAktivitetDagligReiseTso';
import { finnBegrunnelseGrunnerAktivitet } from './utilsDagligReiseTso';
import { aktivitetsdagerErGyldigTall } from './valideringAktivitetsdager';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harIkkeVerdi } from '../../../../utils/utils';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';

export interface AktivitetValidering extends Periode {
    type: AktivitetType | '';
    begrunnelse?: string;
    aktivitetsdager: number | undefined;
}

export const validerAktivitet = (
    endretAktivitet: EndreAktivitetFormDagligReiseTso
): FormErrors<AktivitetValidering> => {
    const feil: FormErrors<AktivitetValidering> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        begrunnelse: undefined,
        aktivitetsdager: undefined,
    };

    if (endretAktivitet.type === '') {
        return { ...feil, type: 'Må velges' };
    }

    const periodeValidering = validerPeriode(endretAktivitet);

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
        endretAktivitet.svarLønnet,
        endretAktivitet.svarHarUtgifter
    );

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretAktivitet.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};
