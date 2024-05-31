import { StegType } from '../../../App/typer/fagsak';

export interface IBehandlingshistorikk {
    behandlingId: string;
    steg: StegType;
    opprettetAv: string;
    endretTid: string;
}
