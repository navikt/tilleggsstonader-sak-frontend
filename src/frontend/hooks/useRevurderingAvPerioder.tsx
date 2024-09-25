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
}): FelterSomKanEndresIPerioden => {
    const { behandling } = useBehandling();
    const datoDetRevurderesFra = behandling.revurderFra;

    const alleDatoerErDefinert = datoDetRevurderesFra && periodeTom && periodeFom;

    if (nyRadLeggesTil || !alleDatoerErDefinert) {
        return 'ALLE';
    } else if (datoErIPeriodeInklusivSlutt(datoDetRevurderesFra, periodeFom, periodeTom)) {
        return 'BARE_TOM';
    } else if (erFør(periodeTom, datoDetRevurderesFra)) {
        return 'INGEN';
    } else {
        // perioden er etter revurder fra-datoen
        return 'ALLE';
    }
};
