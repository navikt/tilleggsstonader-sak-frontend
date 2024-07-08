import { KlagebehandlingSteg } from '../../../typer/klagebehandling/klagebehandlingSteg';

export interface Behandlingshistorikk {
    behandlingId: string;
    steg: KlagebehandlingSteg;
    opprettetAv: string;
    endretTid: string;
}
