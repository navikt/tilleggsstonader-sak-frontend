import { KlagebehandlingSteg } from '../../../App/typer/klagebehandling/klagebehandlingSteg';

export interface IBehandlingshistorikk {
    behandlingId: string;
    steg: KlagebehandlingSteg;
    opprettetAv: string;
    endretTid: string;
}
