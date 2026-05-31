import { EndreAktivitetFormDagligReiseTsr } from './EndreAktivitetDagligReiseTsr';
import { finnBegrunnelseGrunnerAktivitet } from './utilsDagligReiseTsr';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harIkkeVerdi } from '../../../../utils/utils';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';

export interface AktivitetValidering extends Periode {
    type: AktivitetType | '';
    tiltaksvariant?: string;
    aktivitetsdager: number | undefined;
    begrunnelse?: string;
}

export const validerAktivitet = (
    endretAktivitet: EndreAktivitetFormDagligReiseTsr
): FormErrors<AktivitetValidering> => {
    const feil: FormErrors<AktivitetValidering> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        tiltaksvariant: undefined,
        begrunnelse: undefined,
        aktivitetsdager: undefined,
    };

    if (endretAktivitet.type === '') {
        return { ...feil, type: 'Må velges' };
    }

    if (
        endretAktivitet.type !== AktivitetType.INGEN_AKTIVITET &&
        endretAktivitet.tiltaksvariant === undefined
    ) {
        return { ...feil, tiltaksvariant: 'Må velges' };
    }

    const periodeValidering = validerPeriode(endretAktivitet);

    if (periodeValidering) {
        return {
            ...feil,
            ...periodeValidering,
        };
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunnerAktivitet(
        endretAktivitet.type,
        endretAktivitet.svarHarUtgifter
    );

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretAktivitet.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};
