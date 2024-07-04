import { StegType } from '../../../App/typer/klagebehandling';

export interface IBehandlingshistorikk {
    behandlingId: string;
    steg: StegType;
    opprettetAv: string;
    endretTid: string;
}
