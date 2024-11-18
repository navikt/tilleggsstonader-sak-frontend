import { EndreAktivitetForm } from './EndreAktivitetFelles';
import { finnBegrunnelseGrunnerAktivitet } from './utilsLæremidler';
import { AktivitetValidering } from './valideringAktivitet';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { validerPeriode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { harIkkeVerdi } from '../../../../utils/utils';
import { AktivitetLæremidlerNyttFormat, FaktaOgVurderingerLæremidler } from '../typer/aktivitet';

export interface AktivitetValideringLæremidler extends AktivitetValidering {
    prosent?: number;
}

export const validerAktivitet = (
    endretAktivitet: EndreAktivitetForm<FaktaOgVurderingerLæremidler>,
    lagretAktivitet?: AktivitetLæremidlerNyttFormat | undefined,
    revurderesFraDato?: string
): FormErrors<AktivitetValideringLæremidler> => {
    const feil: FormErrors<AktivitetValideringLæremidler> = {
        fom: undefined,
        tom: undefined,
        type: undefined,
        prosent: undefined,
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

    if (!prosentErGyldigTall(endretAktivitet.faktaOgVurderinger.fakta.prosent)) {
        return { ...feil, prosent: 'Prosent må være et tall mellom 1 og 100' };
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunnerAktivitet(
        endretAktivitet.type,
        endretAktivitet.faktaOgVurderinger.vurderinger
    );

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretAktivitet.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};

const prosentErGyldigTall = (prosent: number | undefined): boolean =>
    harTallverdi(prosent) && prosent > 0 && prosent <= 100;
