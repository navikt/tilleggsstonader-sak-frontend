import { BehandlingResultat } from './behandlingResultat';
import { BehandlingStatus } from './behandlingStatus';
import { Stønadstype } from './behandlingTema';
import { BehandlingType } from './behandlingType';
import { BehandlingÅrsak, HenlagtÅrsak } from './behandlingÅrsak';
import { NyeOpplysningerMetadata } from './nyeOpplysningerMetadata';
import { Saksbehandler } from './saksbehandler';
import { Steg } from './steg';

export interface Behandling {
    id: string;
    forrigeIverksatteBehandlingId?: string;
    fagsakId: string;
    fagsakPersonId: string;
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
    revurderFra?: string;
    nyeOpplysningerMetadata?: NyeOpplysningerMetadata;
    tilordnetSaksbehandler?: Saksbehandler;
}

export interface HentBehandlingerRequest {
    ident: string;
    stønadstype: Stønadstype;
}
