import { LocalDate } from '../../../../../utils/dato';
import { KjørelisteDag, ManuellKjørelisteRequest, ManuellRegistreringUkeDto } from '../typer';
import { DagTilInnsending, UkeTilInnsending } from './typer';

export const initialiserUkerTilInnsending = (
    ukerFraRegister: ManuellRegistreringUkeDto[]
): UkeTilInnsending[] => ukerFraRegister.map((ukeFraRegister) => initialiserUke(ukeFraRegister));

const initialiserUke = (ukeFraRegister: ManuellRegistreringUkeDto): UkeTilInnsending => ({
    ukenummer: ukeFraRegister.ukenummer,
    fom: ukeFraRegister.fom,
    tom: ukeFraRegister.tom,
    skalSendesInn: false,
    innsendtTidligere: ukeFraRegister.innsendtTidligere,
    dager: initialiserDagerTilInnsending(ukeFraRegister.dager),
});

export const initialiserDagerTilInnsending = (dagerFraRegister: LocalDate[]): DagTilInnsending[] =>
    dagerFraRegister.map((dag) => tomDag(dag));

export const tomDag = (dag: LocalDate): DagTilInnsending => ({
    dato: dag,
    harKjørt: false,
    parkeringsutgift: undefined,
});

export function tilManuellKjørelisteRequest(
    reiseId: string,
    journalpostId: string,
    begrunnelse: string,
    uker: UkeTilInnsending[]
): ManuellKjørelisteRequest {
    const reisedager: KjørelisteDag[] = uker
        .filter((uke) => uke.skalSendesInn)
        .flatMap((uke) =>
            (uke.dager ?? []).map((dag) => ({
                dato: dag.dato,
                harKjørt: dag.harKjørt,
                parkeringsutgift: dag.parkeringsutgift,
            }))
        );

    return {
        journalpostId,
        reiseId,
        begrunnelse: begrunnelse || undefined,
        reisedager,
    };
}
