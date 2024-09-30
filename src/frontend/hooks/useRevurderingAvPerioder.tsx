import { useBehandling } from '../context/BehandlingContext';
import { datoErIPeriodeInklusivSlutt, erFør } from '../utils/dato';

export type FelterSomKanEndresIPerioden = 'INGEN' | 'BARE_TOM' | 'ALLE';

export const useRevurderingAvPerioder = ({
    periodeFom,
    periodeTom,
    nyRadLeggesTil,
}: {
    periodeFom: string | undefined;
    periodeTom: string | undefined;
    nyRadLeggesTil: boolean;
}): { felterSomKanEndresIPerioden: FelterSomKanEndresIPerioden } => {
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

    return { felterSomKanEndresIPerioden: bestemFelterSomKanEndres() };
};
