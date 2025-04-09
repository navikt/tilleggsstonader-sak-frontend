import { ÅrsakSettPåVent, årsakTilFrist } from './typer';
import { plusDager } from '../../utils/dato';

/**
 * Hver årsak er mappet til frist i antall dager
 * Ved oppdatering av årsaker skal man bruke den høyeste virkedagen
 */
export const finnNyFrist = (årsaker: ÅrsakSettPåVent[]): string => {
    const frister = årsaker
        .map((årsak) => årsakTilFrist[årsak])
        .filter((frist) => frist) as number[]; // det finnes undefined virkedager
    const maksimalFrist = Math.max(...frister);

    if (maksimalFrist > 0) {
        return plusDager(new Date(), maksimalFrist + 1); // Legger til en dag slik at den er dagen etter fristen andre parter har fått
    } else {
        return '';
    }
};
