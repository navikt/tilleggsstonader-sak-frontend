import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Stønadsperiode, Utgiftsperiode } from '../../../../../typer/vedtak';
import { erDatoEtterEllerLik } from '../../../../../utils/dato';
import { validerGyldigTallverdi } from '../../Felles/utils';

export const validerInnvilgetVedtakForm = ({
    stønadsperioder,
    utgiftsperioder,
    begrunnelse,
}: InnvilgeVedtakForm): FormErrors<InnvilgeVedtakForm> => {
    return {
        ...validerPerioder({
            stønadsperioder,
            utgiftsperioder,
        }),
        begrunnelse: !harVerdi(begrunnelse) ? 'Mangelfull utfylling av begrunnelse' : undefined,
    };
};

const validerPerioder = ({
    stønadsperioder,
    utgiftsperioder,
}: {
    stønadsperioder: Stønadsperiode[];
    utgiftsperioder: Utgiftsperiode[];
}): FormErrors<{
    stønadsperioder: Stønadsperiode[];
    utgiftsperioder: Utgiftsperiode[];
}> => {
    return {
        ...validerStønadsperioder(stønadsperioder),
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

        if (!utgiftsperiode.utgifter || utgiftsperiode.utgifter < 0) {
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

const validerStønadsperioder = (
    stønadsperioder: Stønadsperiode[]
): FormErrors<{
    stønadsperioder: Stønadsperiode[];
}> => {
    const feilIStønadsperioder = stønadsperioder.map((periode) => {
        const stønadsperiodeFeil: FormErrors<Stønadsperiode> = {
            fra: undefined,
            til: undefined,
        };

        if (!periode.fra) {
            return { ...stønadsperiodeFeil, fra: 'Mangler fradato for periode' };
        }

        if (!periode.til) {
            return { ...stønadsperiodeFeil, til: 'Mangler tildato for periode' };
        }

        if (!erDatoEtterEllerLik(periode.til, periode.fra)) {
            return {
                ...stønadsperiodeFeil,
                til: 'Sluttdato (til) må være etter startdato (fra) for periode',
            };
        }

        return stønadsperiodeFeil;
    });

    return {
        stønadsperioder: feilIStønadsperioder,
    };
};

const harVerdi = (begrunnelse?: string) => {
    return begrunnelse !== '' && begrunnelse !== undefined;
};
