import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';

export function formaterKrVerdiVedBekreftetSats(verdi: number, bekreftet: boolean): string {
    return bekreftet
        ? `${formaterTallMedTusenSkille(verdi)} kr`
        : `${formaterTallMedTusenSkille(verdi)} kr*`;
}
