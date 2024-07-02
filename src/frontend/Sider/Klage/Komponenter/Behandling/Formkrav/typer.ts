import { PåklagetVedtakstype } from '../../../App/typer/fagsak';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';

export enum VilkårStatus {
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_SATT = 'IKKE_SATT',
}

export enum FormkravFristUnntak {
    UNNTAK_KAN_IKKE_LASTES = 'UNNTAK_KAN_IKKE_LASTES',
    UNNTAK_SÆRLIG_GRUNN = 'UNNTAK_SÆRLIG_GRUNN',
    IKKE_UNNTAK = 'IKKE_UNNTAK',
    IKKE_SATT = 'IKKE_SATT',
}

export const formkravFristUnntakTilTekst: Record<FormkravFristUnntak, string> = {
    UNNTAK_KAN_IKKE_LASTES: 'Ja, klager kan ikke lastes for å ha sendt inn klage etter fristen',
    UNNTAK_SÆRLIG_GRUNN: 'Ja, av særlige grunner er det rimelig at klagen blir behandlet',
    IKKE_UNNTAK: 'Nei',
    IKKE_SATT: 'Ikke satt',
};

export const vilkårStatusTilTekst: Record<VilkårStatus, string> = {
    OPPFYLT: 'Oppfylt',
    IKKE_OPPFYLT: 'Ikke oppfylt',
    IKKE_SATT: 'Ikke satt',
};

export interface IFormalkrav {
    spørsmål: string;
    svar: VilkårStatus;
    navn: string;
    type: EFormalKravType;
}

export enum EFormalKravType {
    KLAGER_ER_PART = 'KLAGER_ER_PART',
    KLAGES_PÅ_KONKRET_ELEMENT_I_VEDTAK = 'KLAGES_PÅ_KONKRET_ELEMENT_I_VEDTAK',
    KLAGEFRIST_OVERHOLDT = 'KLAGEFRIST_OVERHOLDT',
    KLAGE_SIGNERT = 'KLAGE_SIGNERT',
}

export interface IFormkravVilkår {
    behandlingId: string;
    klagePart: VilkårStatus;
    klageKonkret: VilkårStatus;
    klagefristOverholdt: VilkårStatus;
    klagefristOverholdtUnntak: FormkravFristUnntak;
    klageSignert: VilkårStatus;
    saksbehandlerBegrunnelse?: string;
    brevtekst?: string;
    påklagetVedtak: PåklagetVedtak;
    endretTid: string;
}

export interface PåklagetVedtak {
    behandlingId?: string,
    eksternFagsystemBehandlingId?: string;
    påklagetVedtakstype: PåklagetVedtakstype;
    fagsystemVedtak?: FagsystemVedtak;
    manuellVedtaksdato?: string;
}

export enum Redigeringsmodus {
    REDIGERING = 'REDIGERING',
    VISNING = 'VISNING',
    IKKE_PÅSTARTET = 'IKKE_PÅSTARTET',
}

export enum FagsystemType {
    ORDNIÆR = 'ORDNIÆR',
    TILBAKEKREVING = 'TILBAKEKREVING',
    SANKSJON_1_MND = 'SANKSJON_1_MND',
}
