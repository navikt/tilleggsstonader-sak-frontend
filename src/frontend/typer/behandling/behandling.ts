import { BehandlingType } from './behandlingType';
import { Steg } from './steg';
import { BehandlingÅrsak, HenlagtÅrsak } from './behandlingÅrsak';
import { Stønadstype } from './behandlingTema';
import { BehandlingResultat } from './behandlingResultat';
import { BehandlingStatus } from './behandlingstatus';

export interface Behandling {
    id: string;
    forrigeBehandlingId?: string;
    fagsakId: string;
    steg: Steg;
    type: BehandlingType;
    status: BehandlingStatus;
    sistEndret: string;
    resultat: BehandlingResultat;
    opprettet: string;
    opprettetAv: string;
    behandlingsårsak: BehandlingÅrsak;
    henlagtÅrsak?: HenlagtÅrsak;
    stønadstype: Stønadstype;
    vedtaksdato?: string;
}
