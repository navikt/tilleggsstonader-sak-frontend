import { KlagebehandlingSteg } from '../../../App/typer/klagebehandling/klagebehandlingSteg';

export interface Behandlingshistorikk {
    behandlingId: string;
    steg: KlagebehandlingSteg;
    opprettetAv: string;
    endretTid: string;
}
