import { KlagebehandlingSteg } from './klagebehandling/klagebehandlingSteg';
import { ÅrsakSettPåVent } from '../../../komponenter/SettPåVent/typer';

export interface Behandlingshistorikk {
    steg: KlagebehandlingSteg;
    hendelse: BehandlingshistorikkHendelseKlage;
    endretAvNavn: string;
    endretTid: string;
    metadata?: HendelseMetadataKlage;
}

enum StegUtfall {
    HENLAGT = 'HENLAGT',
    SATT_PÅ_VENT = 'SATT_PÅ_VENT',
    TATT_AV_VENT = 'TATT_AV_VENT',
}

type BehandlingshistorikkHendelseKlage = StegUtfall | KlagebehandlingSteg;

const behandlingStegFullførtTilTekst: Record<KlagebehandlingSteg, string> = {
    OPPRETTET: 'Behandling er opprettet',
    FORMKRAV: 'Formkrav er oppdatert',
    VURDERING: 'Vurdering er oppdatert',
    BREV: 'Brev er oppdatert',
    OVERFØRING_TIL_KABAL: 'Overført til Nav klageinstans',
    KABAL_VENTER_SVAR: 'Mottatt svar fra Nav klageinstans',
    BEHANDLING_FERDIGSTILT: 'Klagen er ferdigstilt',
};

const stegUtfall: Record<StegUtfall, string> = {
    HENLAGT: 'Behandling henlagt',
    SATT_PÅ_VENT: 'Satt på vent',
    TATT_AV_VENT: 'Tatt av vent',
};

export const hendelseTilTekst: Record<BehandlingshistorikkHendelseKlage, string> = {
    ...behandlingStegFullførtTilTekst,
    ...stegUtfall,
};

export type HendelseMetadataKlage = SattPåVentMetadataKlage | TattAvVentMetadataKlage;

export interface SattPåVentMetadataKlage {
    årsaker: ÅrsakSettPåVent[];
    kommentarSettPåVent?: string;
}

export interface TattAvVentMetadataKlage {
    kommentar: string;
}
