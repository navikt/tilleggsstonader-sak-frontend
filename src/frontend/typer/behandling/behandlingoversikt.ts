import { BehandlingResultat } from './behandlingResultat';
import { BehandlingStatus } from './behandlingStatus';
import { Stønadstype } from './behandlingTema';
import { BehandlingType } from './behandlingType';
import { BehandlingÅrsak, HenlagtÅrsak } from './behandlingÅrsak';
import { Steg } from './steg';

export interface Behandlingsoversikt {
    fagsakPersonId: string;
    tilsynBarn?: FagsakMedBehandlinger;
}

interface FagsakMedBehandlinger {
    fagsakId: string;
    eksternFagsakId: number;
    stønadstype: Stønadstype;
    erLøpende: boolean;
    behandlinger: BehandlingDetaljer[];
}

export interface BehandlingDetaljer {
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
    vedtaksdato?: string;
    henlagtÅrsak?: HenlagtÅrsak;
    revurderFra?: string;
    vedtaksperiode?: Vedtaksperiode;
}

export interface Vedtaksperiode {
    fom?: string;
    tom?: string;
}
