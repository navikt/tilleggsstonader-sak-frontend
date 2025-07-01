import { useFlag } from '@unleash/proxy-client-react';

import { useBehandling } from '../context/BehandlingContext';
import { dagenFør, datoErIPeriodeInklusivSlutt, erDatoEtterEllerLik, erFør } from '../utils/dato';
import { Toggle } from '../utils/toggles';

type FelterSomKanEndresIPerioden = 'INGEN' | 'BARE_TOM' | 'ALLE';

const kanPeriodeSlettes = (
    revurderFra: string | undefined,
    periodeFom: string | undefined,
    nyRadLeggesTil: boolean
): boolean => {
    if (nyRadLeggesTil || !revurderFra || !periodeFom) {
        return true;
    }
    return erDatoEtterEllerLik(revurderFra, periodeFom);
};

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
    kanSlettePeriode: boolean;
} => {
    const { behandling } = useBehandling();
    const skalUtledeEndringsdatoAutomatisk = useFlag(Toggle.SKAL_UTLEDE_ENDRINGSDATO_AUTOMATISK);
    const datoDetRevurderesFra = behandling.revurderFra;

    const noenAvDatoeneErUdefinert = !(datoDetRevurderesFra && periodeTom && periodeFom);

    // TODO: Gi status bare tom hvis dato er en dag før revurder fra også!
    const bestemFelterSomKanEndres = (): FelterSomKanEndresIPerioden => {
        if (nyRadLeggesTil || noenAvDatoeneErUdefinert || skalUtledeEndringsdatoAutomatisk) {
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

    const felterSomKanEndres = bestemFelterSomKanEndres();
    const alleFelterKanEndres = felterSomKanEndres === 'ALLE';
    const helePeriodenErLåstForEndring = felterSomKanEndres === 'INGEN';
    const kanSlettePeriode = kanPeriodeSlettes(datoDetRevurderesFra, periodeFom, nyRadLeggesTil);

    return {
        alleFelterKanEndres,
        helePeriodenErLåstForEndring,
        kanSlettePeriode,
    };
};
