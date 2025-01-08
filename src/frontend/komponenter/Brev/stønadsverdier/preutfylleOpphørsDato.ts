import { Brevverdier } from './verdier';
import { formaterNullableTilTekstligDato } from '../../../utils/dato';

export const preutfylleOpphørsDato = (revurderFra: string | undefined): Brevverdier => {
    // https://tilleggsstonader-brev.sanity.studio/structure/variabel;6fda75ec-b9da-4594-8249-0d41686347ea
    const opphorsDato = '6fda75ec-b9da-4594-8249-0d41686347ea';

    return {
        variabelStore: {
            [opphorsDato]: formaterNullableTilTekstligDato(revurderFra) ?? '',
        },
    };
};
