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

        // TODO: Legge til sjekk av datoer mot forrige periode?

        if (!utgiftsperiode.aktivitetstype) {
            return { ...utgiftsperiodeFeil, aktivitetstype: 'Mangler valg for aktivitetstype' };
        }

        if (!utgiftsperiode.antallAktivitetsdager) {
            return {
                ...utgiftsperiodeFeil,
                antallAktivitetsdager: 'Mangler valg av antall aktivitetsdager',
            };
        }

        if (utgiftsperiode.barn.length === 0) {
            return {
                ...utgiftsperiodeFeil,
                barn: ['Mangelfull utfylling - minst et barn må velges'],
            };
        }

        if (!utgiftsperiode.utgifter) {
            return {
                ...utgiftsperiodeFeil,
                utgifter: 'Mangelfull utfylling av utgifter',
            };
        }

        if (!utgiftsperiode.dagerMedTilsyn) {
            return {
                ...utgiftsperiodeFeil,
                dagerMedTilsyn: 'Mangler valg av dager med tilsyn',
            };
        }

        return utgiftsperiodeFeil;
    });

    return {
        utgiftsperioder: feilIUtgiftsperioder,
    };
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
