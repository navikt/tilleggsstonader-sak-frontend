import { BehandlingStatus } from './behandling/behandlingStatus';

export interface Klagebehandlinger {
    tilsynBarn: KlageBehandling[];
    læremidler: KlageBehandling[];
    boutgifter: KlageBehandling[];
    dagligReiseTSO: KlageBehandling[];
    dagligReiseTSR: KlageBehandling[];
}

export interface KlageBehandling {
    fagsakId: string;
    id: string;
    mottattDato: string;
    opprettet: string;
    resultat: KlagebehandlingResultat | undefined;
    status: BehandlingStatus;
    vedtaksdato: string | undefined;
    årsak: KlageÅrsak | undefined;
    klageinstansResultat: KlageinstansResultat[];
    henlagtÅrsak: KlageHenlagtÅrsak | undefined;
    henlagtBegrunnelse: string | undefined;
}

export interface KlageinstansResultat {
    type: KlageinstansEventType;
    utfall: KlageinstansUtfall;
    mottattEllerAvsluttetTidspunkt: string;
    årsakFeilregistrert?: string;
}

export enum KlageinstansEventType {
    KLAGEBEHANDLING_AVSLUTTET = 'KLAGEBEHANDLING_AVSLUTTET',
    BEHANDLING_FEILREGISTRERT = 'BEHANDLING_FEILREGISTRERT',
    ANKEBEHANDLING_OPPRETTET = 'ANKEBEHANDLING_OPPRETTET',
    ANKEBEHANDLING_AVSLUTTET = 'ANKEBEHANDLING_AVSLUTTET',
    ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET = 'ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET',
}

export enum KlageinstansUtfall {
    TRUKKET = 'TRUKKET',
    RETUR = 'RETUR',
    OPPHEVET = 'OPPHEVET',
    MEDHOLD = 'MEDHOLD',
    DELVIS_MEDHOLD = 'DELVIS_MEDHOLD',
    STADFESTELSE = 'STADFESTELSE',
    UGUNST = 'UGUNST',
    AVVIST = 'AVVIST',
    INNSTILLING_STADFESTELSE = 'INNSTILLING_STADFESTELSE',
    INNSTILLING_AVVIST = 'INNSTILLING_AVVIST',
}

export enum KlagebehandlingResultat {
    MEDHOLD = 'MEDHOLD',
    IKKE_MEDHOLD = 'IKKE_MEDHOLD',
    IKKE_MEDHOLD_FORMKRAV_AVVIST = 'IKKE_MEDHOLD_FORMKRAV_AVVIST',
    IKKE_SATT = 'IKKE_SATT',
}

export enum KlagebehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    SATT_PÅ_VENT = 'SATT_PÅ_VENT',
    VENTER = 'VENTER',
    FERDIGSTILT = 'FERDIGSTILT',
}

export enum KlageÅrsak {
    FEIL_I_LOVANDVENDELSE = 'FEIL_I_LOVANDVENDELSE',
    FEIL_REGELVERKSFORSTÅELSE = 'FEIL_REGELVERKSFORSTÅELSE',
    FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
    FEIL_PROSESSUELL = 'FEIL_PROSESSUELL',
    KØET_BEHANDLING = 'KØET_BEHANDLING',
    ANNET = 'ANNET',
}

export enum KlageHenlagtÅrsak {
    TRUKKET_TILBAKE = 'TRUKKET_TILBAKE',
    FEILREGISTRERT = 'FEILREGISTRERT',
}

export const klageinstansUtfallTilTekst: Record<KlageinstansUtfall, string> = {
    TRUKKET: 'Trukket KA',
    RETUR: 'Retur KA',
    OPPHEVET: 'Opphevet KA',
    MEDHOLD: 'Medhold KA',
    DELVIS_MEDHOLD: 'Delvis medhold KA',
    STADFESTELSE: 'Stadfestelse KA',
    UGUNST: 'Ugunst (Ugyldig) KA',
    AVVIST: 'Avvist KA',
    INNSTILLING_STADFESTELSE: 'Innstilling om stadfestelse til trygderetten fra KA',
    INNSTILLING_AVVIST: 'Innstilling om avist til trygderetten fra KA',
};
