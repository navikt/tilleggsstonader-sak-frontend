import { FagsystemType } from '../Steg/Formkrav/typer';

export interface FagsystemVedtak {
    behandlingstype: string;
    resultat: string;
    eksternBehandlingId: string;
    vedtakstidspunkt: string;
    fagsystemType: FagsystemType;
}
