import { EndreAktivitetFormLæremidler } from './EndreAktivitetLæremidler';
import { finnBegrunnelseGrunnerAktivitet } from './utilsLæremidler';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Periode, validerPeriode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { harIkkeVerdi } from '../../../../utils/utils';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import { SvarJaNei } from '../typer/vilkårperiode/vilkårperiode';

export interface AktivitetValidering extends Periode {
    type: AktivitetType | '';
    prosent?: number;
    studienivå?: string;
    begrunnelse?: string;
}

export const validerAktivitet = (
    endretAktivitet: EndreAktivitetFormLæremidler
): FormErrors<AktivitetValidering> => {
    const feil: FormErrors<AktivitetValidering> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        prosent: undefined,
        studienivå: undefined,
        begrunnelse: undefined,
    };

    if (endretAktivitet.type === '') {
        return { ...feil, type: 'Må velges' };
    }

    const periodefeil = validerPeriode(endretAktivitet);

    if (periodefeil) {
        return {
            ...feil,
            ...periodefeil,
        };
    }

    if (endretAktivitet.type !== AktivitetType.INGEN_AKTIVITET) {
        if (!prosentErGyldigTall(endretAktivitet.prosent)) {
            return { ...feil, prosent: 'Prosent må være et tall mellom 1 og 100' };
        }

        const brukerHarUtgifter = endretAktivitet.vurderinger.svarHarUtgifter === SvarJaNei.JA;
        const studienivåErIkkeVurdert = !endretAktivitet.studienivå;
        if (brukerHarUtgifter && studienivåErIkkeVurdert) {
            return { ...feil, studienivå: 'Studienivå må velges' };
        }
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunnerAktivitet(
        endretAktivitet.type,
        endretAktivitet.vurderinger
    );

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretAktivitet.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};

const prosentErGyldigTall = (prosent: number | undefined): boolean =>
    harTallverdi(prosent) && prosent > 0 && prosent <= 100;
