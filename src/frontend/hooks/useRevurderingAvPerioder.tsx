import { useBehandling } from '../context/BehandlingContext';
import { datoErIPeriodeInklusivSlutt, erFør } from '../utils/dato';

type FelterSomKanEndresIPerioden = 'INGEN' | 'BARE_TOM' | 'ALLE';

export const useRevurderingAvPerioder = ({
    periodeFom,
    periodeTom,
    nyRadLeggesTil,
}: {
    periodeFom: string | undefined;
    periodeTom: string | undefined;
    nyRadLeggesTil: boolean;
}): {
    alleFelterKanEndres: boolean;
    helePeriodenErLåstForEndring: boolean;
} => {
    const { behandling } = useBehandling();
    const datoDetRevurderesFra = behandling.revurderFra;

    const noenAvDatoeneErUdefinert = !(datoDetRevurderesFra && periodeTom && periodeFom);

    const bestemFelterSomKanEndres = (): FelterSomKanEndresIPerioden => {
        if (nyRadLeggesTil || noenAvDatoeneErUdefinert) {
            return 'ALLE';
        } else if (datoErIPeriodeInklusivSlutt(datoDetRevurderesFra, periodeFom, periodeTom)) {
            return 'BARE_TOM';
        } else if (erFør(periodeTom, datoDetRevurderesFra)) {
            return 'INGEN';
        } else {
            return 'ALLE';
        }
    };

    const alleFelterKanEndres = bestemFelterSomKanEndres() === 'ALLE';
    const helePeriodenErLåstForEndring = bestemFelterSomKanEndres() === 'INGEN';

    return {
        alleFelterKanEndres,
        helePeriodenErLåstForEndring,
    };
};
