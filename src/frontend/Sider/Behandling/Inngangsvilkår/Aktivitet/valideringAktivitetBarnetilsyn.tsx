import { EndreAktivitetForm } from './EndreAktivitetFelles';
import { finnBegrunnelseGrunnerAktivitetBarnetilsyn } from './utilsBarnetilsyn';
import { AktivitetValidering } from './valideringAktivitet';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { validerPeriode } from '../../../../utils/periode';
import { harTallverdi } from '../../../../utils/tall';
import { harIkkeVerdi } from '../../../../utils/utils';
import { AktivitetBarnetilsynNyttFormat, FaktaOgVurderingerBarnetilsyn } from '../typer/aktivitet';

export interface AktivitetValideringBarnetilsyn extends AktivitetValidering {
    aktivitetsdager?: number;
}

export const validerAktivitetBarnetilsyn = (
    endretAktivitet: EndreAktivitetForm<FaktaOgVurderingerBarnetilsyn>,
    lagretAktivitet?: AktivitetBarnetilsynNyttFormat | undefined,
    revurderesFraDato?: string
): FormErrors<AktivitetValideringBarnetilsyn> => {
    const feil: FormErrors<AktivitetValideringBarnetilsyn> = {
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

    if (!aktivitetsdagerErGyldigTall(endretAktivitet.faktaOgVurderinger.fakta.aktivitetsdager)) {
        return { ...feil, aktivitetsdager: 'Aktivitetsdager må være et tall mellom 1 og 5' };
    }

    const obligatoriskeBegrunnelser = finnBegrunnelseGrunnerAktivitetBarnetilsyn(
        endretAktivitet.type,
        endretAktivitet.faktaOgVurderinger.vurderinger
    );

    if (obligatoriskeBegrunnelser.length > 0 && harIkkeVerdi(endretAktivitet.begrunnelse))
        return { ...feil, begrunnelse: 'Begrunnelse er obligatorisk' };

    return feil;
};

const aktivitetsdagerErGyldigTall = (aktivitetsdager: number | undefined): boolean =>
    harTallverdi(aktivitetsdager) && aktivitetsdager >= 1 && aktivitetsdager <= 5;
