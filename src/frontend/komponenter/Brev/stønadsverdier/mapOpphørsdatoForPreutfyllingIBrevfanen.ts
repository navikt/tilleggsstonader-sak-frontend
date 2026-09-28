import { Brevverdier } from './verdier';
import { formaterNullableTilTekstligDato } from '../../../utils/dato';

export const mapOpphørsdatoForPreutfyllingIBrevfanen = (
    opphørsdato: string | undefined,
    navnBruker: string
): Brevverdier => {
    // https://tilleggsstonader-brev.sanity.studio/structure/variabel;6fda75ec-b9da-4594-8249-0d41686347ea
    const opphorsDato = '6fda75ec-b9da-4594-8249-0d41686347ea';
    const navnBrukerVariabel = '46cc749b-67af-4f2a-9b28-5456e5de5212';

    return {
        variabelStore: {
            [opphorsDato]: formaterNullableTilTekstligDato(opphørsdato) ?? '',
            [navnBrukerVariabel]: navnBruker,
        },
    };
};
