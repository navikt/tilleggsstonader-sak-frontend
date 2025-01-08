import { Brevverdier } from './verdier';
import { formaterNullableTilTekstligDato } from '../../../utils/dato';

export const mapVedtaksDatoerForPreutfyllingIBrevfanen = (
    fom: string | undefined,
    tom: string | undefined
): Brevverdier => {
    //https://tilleggsstonader-brev.sanity.studio/structure/laeremidler;invilgelse;6d14d8e6-3741-4bad-bd7f-a9dcd0fa22bf;9d6919a1-3ba1-48d4-9c4e-3b58a9a1744c%2Ctype%3Ddelmal%2CparentRefPath%3Ddelmaler%255B_key%253D%253D%2522be79f48bc3cc%2522%255D.delmalReferanse;8b96cc19-1e86-4f20-85e7-9ec64508d39e%2Ctype%3Dvalgfelt%2CparentRefPath%3Dnb%255B_key%253D%253D%25223006eac1e5a6%2522%255D.valgfelt;83376609-c232-4220-97e3-7757e575b7ac%2Ctype%3Dtekst%2CparentRefPath%3Dvalg%255B_key%253D%253D%25229a698e8bf101%2522%255D;4c734ef6-4a7b-4956-bebd-b4cb95048420%2Ctype%3Dvariabel%2CparentRefPath%3Dnb%255B_key%253D%253D%2522f0d3c8af7e0c%2522%255D.markDefs%255B_key%253D%253D%25223d434c0fe629%2522%255D.variabelreferanse
    const variabelIdVedtakFraDato = 'f194e1fa-ba7a-4338-96fb-1d2b1a586dd3';
    const VariabelIdVedtakTilDato = 'e67f3fe5-a318-447b-97c4-1495c132b61e';

    return {
        variabelStore: {
            [variabelIdVedtakFraDato]: formaterNullableTilTekstligDato(fom) ?? '',
            [VariabelIdVedtakTilDato]: formaterNullableTilTekstligDato(tom) ?? '',
        },
    };
};
