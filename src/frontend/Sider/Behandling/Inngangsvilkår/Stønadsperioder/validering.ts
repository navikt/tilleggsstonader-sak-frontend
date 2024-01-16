import { FormErrors } from '../../../../hooks/felles/useFormState';
import { erPeriodeInnenforAnnenPeriode, validerPeriode } from '../../../../utils/periode';
import { Vilkårsresultat } from '../../vilkår';
import Målgruppe from '../Målgruppe/Målgruppe';
import { Stønadsperiode } from '../typer';
import { Aktivitet } from '../typer/aktivitet';

export const validerStønadsperioder = (
    stønadsperioder: Stønadsperiode[],
    målgrupper: Målgruppe[],
    aktiviteter: Aktivitet[]
): FormErrors<Stønadsperiode[]> => {
    const feilIStønadsperioder = stønadsperioder.map((periode) => {
        const stønadsperiodeFeil: FormErrors<Stønadsperiode> = {
            målgruppe: undefined,
            aktivitet: undefined,
            fom: undefined,
            tom: undefined,
        };

        if (!periode.målgruppe) {
            return { ...stønadsperiodeFeil, målgruppe: 'Mangler målgruppe for periode' };
        }

        if (!periode.aktivitet) {
            return { ...stønadsperiodeFeil, aktivitet: 'Mangler aktivitet for periode' };
        }

        const periodeValidering = validerPeriode(periode);
        if (periodeValidering) {
            return {
                ...stønadsperiodeFeil,
                ...periodeValidering,
            };
        }

        // TODO: Flytte validering under til backend?
        // TODO valider at målgruppe og aktivitet sammen er gyldige
        const relevanteMålgrupper = målgrupper.filter(
            (målgruppe) =>
                periode.målgruppe === målgruppe.type &&
                målgruppe.resultat === Vilkårsresultat.OPPFYLT
        );

        if (relevanteMålgrupper.length === 0) {
            return {
                ...stønadsperiodeFeil,
                målgruppe: 'Finnes ingen periode for målgruppe hvor vilkår er oppfylt',
            };
        }

        const målgrupperInnenfor = relevanteMålgrupper.some((målgruppe) =>
            erPeriodeInnenforAnnenPeriode(periode, målgruppe)
        );

        if (!målgrupperInnenfor) {
            return {
                ...stønadsperiodeFeil,
                målgruppe: 'Ingen relevante målgruppeperioder rommer stønadsperioden',
            };
        }

        const relevanteAktiviteter = aktiviteter.filter(
            (aktivitet) =>
                periode.aktivitet === aktivitet.type &&
                aktivitet.resultat === Vilkårsresultat.OPPFYLT
        );

        if (relevanteAktiviteter.length === 0) {
            return {
                ...stønadsperiodeFeil,
                aktivitet: 'Finnes ingen periode for aktivitet hvor vilkår er oppfylt',
            };
        }

        const aktivitetInnenfor = relevanteAktiviteter.some((målgruppe) =>
            erPeriodeInnenforAnnenPeriode(periode, målgruppe)
        );

        if (!aktivitetInnenfor) {
            return {
                ...stønadsperiodeFeil,
                aktivitet: 'Ingen relevante aktivitetperioder rommer stønadsperioden',
            };
        }

        return stønadsperiodeFeil;
    });

    return feilIStønadsperioder;
};
