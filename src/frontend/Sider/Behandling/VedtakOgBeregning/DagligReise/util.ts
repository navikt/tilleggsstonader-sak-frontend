import { FormatertSats } from './typer';
import { RammeForReiseMedPrivatBilSatsForDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';
import { formaterTallMedTusenSkille } from '../../../../utils/fomatering';
import { kronerMedTusenSkilleEllerStrek } from '../../../../utils/tekstformatering';

export const formaterKilometersatser = (
    satser: RammeForReiseMedPrivatBilSatsForDelperiode[]
): FormatertSats[] =>
    satser.map((sats) => ({
        fom: sats.fom,
        tom: sats.tom,
        verdi: formaterTallMedTusenSkille(sats.kilometersats) + ' kr/km',
    }));

export const formaterDagsatser = (
    satser: RammeForReiseMedPrivatBilSatsForDelperiode[]
): FormatertSats[] =>
    satser.map((sats) => ({
        fom: sats.fom,
        tom: sats.tom,
        verdi: kronerMedTusenSkilleEllerStrek(sats.dagsatsUtenParkering),
    }));
