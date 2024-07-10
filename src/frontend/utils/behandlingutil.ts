import { compareDesc } from 'date-fns';

import { TabellBehandling } from '../Sider/Personoversikt/Behandlingsoversikt/BehandlingTabell';
import { Behandling } from '../typer/behandling/behandling';
import { BehandlingType } from '../typer/behandling/behandlingType';
import { KlageBehandling } from '../typer/klage';

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

export const mapFagsakPersonRessursTilTabellBehandling = (
    behandlinger: Behandling[] | undefined
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
        };
    });
    return tabellBehandlinger ?? [];
};

export const mapKlagesakRessursTilTabellBehandling = (
    klageBehandlinger: KlageBehandling[] | undefined
): TabellBehandling[] => {
    const tabellBehandlinger = klageBehandlinger?.map((klageBehandling) => {
        return {
            id: klageBehandling.id,
            opprettet: klageBehandling.opprettet,
            type: BehandlingType.KLAGE,
            behandlingsårsak: klageBehandling.årsak,
            status: klageBehandling.status,
            vedtaksdato: klageBehandling.vedtaksdato,
            resultat: klageBehandling.resultat,
        };
    });
    return tabellBehandlinger ?? [];
};
