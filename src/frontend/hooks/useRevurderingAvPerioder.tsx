import { useBehandling } from '../context/BehandlingContext';
import { dagenFør, datoErIPeriodeInklusivSlutt, erFør } from '../utils/dato';

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

    // TODO: Gi status bare tom hvis dato er en dag før revurder fra også!
    const bestemFelterSomKanEndres = (): FelterSomKanEndresIPerioden => {
        if (nyRadLeggesTil || noenAvDatoeneErUdefinert) {
            return 'ALLE';
        }

        const dagenFørDetRevurderesFra = dagenFør(datoDetRevurderesFra);

        if (datoErIPeriodeInklusivSlutt(dagenFørDetRevurderesFra, periodeFom, periodeTom)) {
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
