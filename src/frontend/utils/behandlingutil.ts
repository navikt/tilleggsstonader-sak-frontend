import { compareDesc } from 'date-fns';

import { behandlingResultatTilTekst as klagebehandlingResultatTilTekst } from '../Sider/Klage/utils/behandlingsresultat';
import { BehandlingDetaljer, Vedtaksperiode } from '../typer/behandling/behandlingoversikt';
import {
    BehandlingResultat,
    behandlingResultatTilTekst,
} from '../typer/behandling/behandlingResultat';
import { BehandlingStatus } from '../typer/behandling/behandlingStatus';
import { BehandlingType } from '../typer/behandling/behandlingType';
import { BehandlingÅrsak, HenlagtÅrsak } from '../typer/behandling/behandlingÅrsak';
import {
    KlageBehandling,
    KlagebehandlingResultat,
    KlagebehandlingStatus,
    KlageHenlagtÅrsak,
    KlageinstansEventType,
    KlageinstansResultat,
    klageinstansUtfallTilTekst,
    KlageÅrsak,
} from '../typer/klage';

/**
 * Sorterer behandlinger etter vedtaksdato
 * Hvis vedtaksdato ikke finnes på noen av behandlingene, sorteres de etter opprettet
 * Hvis vedtaksdato ikke finnes på en av behandlingene sorteres null/undefined først
 */
export const sorterBehandlinger = <T extends { vedtaksdato?: string; opprettet: string }>(
    a: T,
    b: T
): number => {
    if (a.vedtaksdato && b.vedtaksdato) {
        return compareDesc(new Date(a.vedtaksdato), new Date(b.vedtaksdato));
    }
    if (!a.vedtaksdato && !b.vedtaksdato) {
        return compareDesc(new Date(a.opprettet), new Date(b.opprettet));
    }
    return a.vedtaksdato ? 1 : -1;
};

export const mapFagsakPersonTilTabellrader = (
    behandlinger: BehandlingDetaljer[] | undefined
): TabellBehandling[] => {
    const tabellBehandlinger = behandlinger?.map((behandling) => {
        return {
            id: behandling.id,
            opprettet: behandling.opprettet,
            type: behandling.type,
            behandlingsårsak: behandling.behandlingsårsak,
            status: behandling.status,
            vedtaksdato: behandling.vedtaksdato,
            resultat: behandling.resultat,
            henlagtÅrsak: behandling.henlagtÅrsak,
            henlagtBegrunnelse: behandling.henlagtBegrunnelse,
            vedtaksperiode: behandling.vedtaksperiode,
        };
    });
    return tabellBehandlinger ?? [];
};

export const mapKlagesakerTilTabellrader = (
    klageBehandlinger: KlageBehandling[] | undefined
): TabelllBehandlingKlage[] =>
    klageBehandlinger?.map((klageBehandling) => ({
        id: klageBehandling.id,
        opprettet: klageBehandling.opprettet,
        type: BehandlingType.KLAGE,
        behandlingsårsak: klageBehandling.årsak,
        status: klageBehandling.status,
        vedtaksdato: klageBehandling.vedtaksdato,
        resultat: klageBehandling.resultat,
        henlagtÅrsak: klageBehandling.henlagtÅrsak,
        henlagtBegrunnelse: klageBehandling.henlagtBegrunnelse,
        klageinstansResultat: klageBehandling.klageinstansResultat,
    })) ?? [];

export interface TabellBehandling {
    id: string;
    opprettet: string;
    type: BehandlingType;
    behandlingsårsak: BehandlingÅrsak | KlageÅrsak | undefined;
    status: BehandlingStatus | KlagebehandlingStatus;
    vedtaksdato?: string | undefined;
    resultat: BehandlingResultat | KlagebehandlingResultat | undefined;
    henlagtÅrsak: HenlagtÅrsak | KlageHenlagtÅrsak | undefined;
    henlagtBegrunnelse: string | undefined;
    vedtaksperiode?: Vedtaksperiode;
}

export interface TabelllBehandlingKlage extends TabellBehandling {
    type: BehandlingType.KLAGE;
    klageinstansResultat?: KlageinstansResultat[];
}

const erTabellBehandlingKlage = (
    behandling: TabellBehandling
): behandling is TabelllBehandlingKlage => behandling.type === BehandlingType.KLAGE;

export const erKlageOgFeilregistrertAvKA = (behandling: TabellBehandling) =>
    erTabellBehandlingKlage(behandling) &&
    behandling.klageinstansResultat?.some(
        (resultat) => resultat.type == KlageinstansEventType.BEHANDLING_FEILREGISTRERT
    );

export const utledBehandlingResultatTilTekst = (behandling: TabellBehandling) => {
    if (erTabellBehandlingKlage(behandling)) {
        const klageBehandlingAvsluttetUtfall = behandling.klageinstansResultat?.find(
            (resultat) =>
                resultat.utfall && resultat.type == KlageinstansEventType.KLAGEBEHANDLING_AVSLUTTET
        )?.utfall;

        if (klageBehandlingAvsluttetUtfall) {
            return klageinstansUtfallTilTekst[klageBehandlingAvsluttetUtfall];
        }
        if (erKlageOgFeilregistrertAvKA(behandling)) {
            return 'Feilregistrert (KA)';
        }
    }
    return behandling.resultat ? behaandlingResultatTilTekst[behandling.resultat] : 'Ikke satt';
};

const behaandlingResultatTilTekst: Record<BehandlingResultat | KlagebehandlingResultat, string> = {
    ...behandlingResultatTilTekst,
    ...klagebehandlingResultatTilTekst,
};
