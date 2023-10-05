import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Utgiftsperiode } from '../../../../../typer/vedtak';
import { erDatoEtterEllerLik } from '../../../../../utils/dato';
import { validerGyldigTallverdi } from '../../Felles/utils';

export const validerInnvilgetVedtakForm = ({
    utgiftsperioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            utgiftsperioder,
        }),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

const validerPerioder = ({
    utgiftsperioder,
}: {
    utgiftsperioder: Utgiftsperiode[];
}): FormErrors<{
    utgiftsperioder: Utgiftsperiode[];
}> => {
    return {
        ...validerUtgiftsperioder({ utgiftsperioder }),
    };
};

const validerUtgiftsperioder = ({
    utgiftsperioder,
}: {
    utgiftsperioder: Utgiftsperiode[];
}): FormErrors<{ utgiftsperioder: Utgiftsperiode[] }> => {
    const feilIUtgiftsperioder = utgiftsperioder.map((utgiftsperiode) => {
        const { utgifter } = utgiftsperiode;
        const utgiftsperiodeFeil: FormErrors<Utgiftsperiode> = {
            periodetype: undefined,
            aktivitetstype: undefined,
            antallAktivitetsdager: undefined,
            fra: undefined,
            til: undefined,
            barn: [],
            utgifter: validerGyldigTallverdi(utgifter),
            dagerMedTilsyn: undefined,
        };

        if (!utgiftsperiode.periodetype) {
            return { ...utgiftsperiodeFeil, periodetype: 'Mangler valg for periodetype' };
        }

        if (!utgiftsperiode.fra) {
            return { ...utgiftsperiodeFeil, fra: 'Mangler fradato for periode' };
        }

        if (!utgiftsperiode.til) {
            return { ...utgiftsperiodeFeil, til: 'Mangler tildato for periode' };
        }

        if (!erDatoEtterEllerLik(utgiftsperiode.til, utgiftsperiode.fra)) {
            return {
                ...utgiftsperiodeFeil,
                til: 'Sluttdato (til) må være etter startdato (fra) for periode',
            };
        }

        // const forrige = index > 0 && utgiftsperioder[index - 1];

        // if (forrige && forrige.årMånedTil) {
        //     if (!erMånedÅrEtter(forrige.årMånedTil, årMånedFra)) {
        //         return {
        //             ...utgiftsperiodeFeil,
        //             årMånedFra: `Ugyldig etterfølgende periode - fra (${årMånedFra}) må være etter til (${forrige.årMånedTil})`,
        //         };
        //     }
        // }

        // if (barn.length < 1 && !opphørEllerSanksjon) {
        //     return {
        //         ...utgiftsperiodeFeil,
        //         barn: ['Mangelfull utfylling - minst et barn må velges'],
        //     };
        // }

        // if (barn.length > 0 && opphørEllerSanksjon) {
        //     return {
        //         ...utgiftsperiodeFeil,
        //         barn: ['Skal ikke kunne velge barn ved opphør eller sanksjon'],
        //     };
        // }

        return utgiftsperiodeFeil;
    });

    return {
        utgiftsperioder: feilIUtgiftsperioder,
    };
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
