import { BehandlingResultat } from './behandlingResultat';
import { BehandlingStatus } from './behandlingStatus';
import { Stønadstype } from './behandlingTema';
import { BehandlingType } from './behandlingType';
import { BehandlingÅrsak, HenlagtÅrsak } from './behandlingÅrsak';
import { NyeOpplysningerMetadata } from './nyeOpplysningerMetadata';
import { Steg } from './steg';
import { TilordnetSaksbehandlerDto } from './tilordnetSaksbehandlerDto';

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
    nyeOpplysningerMetadata?: NyeOpplysningerMetadata;
    tilordnetSaksbehandler?: TilordnetSaksbehandlerDto;
}

export interface BehandlingForJournalføring {
    id: string;
    type: BehandlingType;
    status: BehandlingStatus;
    sistEndret: string;
    resultat: BehandlingResultat;
    behandlingsÅrsak: BehandlingÅrsak;
}

export interface HentBehandlingerRequest {
    ident: string;
    stønadstype: Stønadstype;
}

export interface SluttdatoForForrigeVedtak {
    sluttdato?: string;
}
