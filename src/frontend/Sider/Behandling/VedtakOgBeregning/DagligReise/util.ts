import { FormatertSats } from './typer';
import { RammeForReiseMedPrivatBilSatsForDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';

export const formaterKilometersatser = (
    satser: RammeForReiseMedPrivatBilSatsForDelperiode[]
): FormatertSats[] =>
    satser.map((sats) => ({
        fom: sats.fom,
        tom: sats.tom,
        verdi: formaterTallMedTusenSkille(sats.kilometersats) + ' kr/km',
    }));
