import { ÅrsakSettPåVent } from '../../SettPåVent/typer';
import { ÅrsakUnderkjent } from '../../Totrinnskontroll/typer';

export interface HistorikkHendelse {
    behandlingId: string;
    hendelse: Hendelse;
    endretAvNavn: string;
    endretTid: string;
    metadata?: HendelseMetadata;
}

export type HendelseMetadata = SattPåVentMetadata | VedtakUnderkjentMetadata | TattAvVentMetadata;

export interface SattPåVentMetadata {
    årsaker: ÅrsakSettPåVent[];
    kommentarSettPåVent?: string;
}

export interface VedtakUnderkjentMetadata {
    årsakerUnderkjent: ÅrsakUnderkjent[];
    begrunnelse: string;
}

export interface TattAvVentMetadata {
    kommentar: string;
}

export enum Hendelse {
    OPPRETTET = 'OPPRETTET',
    SATT_PÅ_VENT = 'SATT_PÅ_VENT',
    TATT_AV_VENT = 'TATT_AV_VENT',
    SENDT_TIL_BESLUTTER = 'SENDT_TIL_BESLUTTER',
    ANGRE_SEND_TIL_BESLUTTER = 'ANGRE_SEND_TIL_BESLUTTER',
    VEDTAK_GODKJENT = 'VEDTAK_GODKJENT',
    VEDTAK_UNDERKJENT = 'VEDTAK_UNDERKJENT',
    VEDTAK_IVERKSATT = 'VEDTAK_IVERKSATT',
    VEDTAK_AVSLÅTT = 'VEDTAK_AVSLÅTT',
    HENLAGT = 'HENLAGT',
}

export const hendelseTilHistorikkTekst: Record<Hendelse, string> = {
    OPPRETTET: 'Behandling opprettet',
    SATT_PÅ_VENT: 'Satt på vent',
    TATT_AV_VENT: 'Tatt av vent',
    SENDT_TIL_BESLUTTER: 'Sendt til beslutter',
    VEDTAK_GODKJENT: 'Vedtak godkjent',
    VEDTAK_UNDERKJENT: 'Vedtak underkjent',
    VEDTAK_IVERKSATT: 'Vedtak iverksatt',
    VEDTAK_AVSLÅTT: 'Vedtak avslått',
    HENLAGT: 'Behandling henlagt',
    ANGRE_SEND_TIL_BESLUTTER: 'Angret send til beslutter',
};
