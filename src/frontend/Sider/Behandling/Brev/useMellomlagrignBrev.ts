import { useCallback, useEffect, useState } from 'react';

import { Fritekst, FritekstAvsnitt, Tekst } from './typer';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';

export interface MellomlagretBrevDto {
    brevverdier: string;
    brevmal: string;
}

export interface IBrevverdier {
    inkluderteDelmaler?: Record<string, boolean>;
    fritekst?: Partial<Record<string, Record<string, FritekstAvsnitt[] | undefined>>>;
    valgfelt?: Partial<Record<string, Record<string, Fritekst | Tekst>>>;
    variabler?: Partial<Record<string, Record<string, string>>>;
}

const useMellomlagringBrev = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [mellomlagretBrev, settMellomlagretBrev] =
        useState<Ressurs<MellomlagretBrevDto>>(byggTomRessurs());

    const hentMellomlagretBrev = useCallback(() => {
        request<MellomlagretBrevDto, unknown>(`/api/sak/brev/mellomlager/${behandling.id}`).then(
            settMellomlagretBrev
        );
    }, [request, behandling.id]);

    useEffect(hentMellomlagretBrev, [hentMellomlagretBrev]);

    return { mellomlagretBrev };
};

export default useMellomlagringBrev;

export function parseMellomlagretBrev(mellomlagretBrev: MellomlagretBrevDto | undefined) {
    const {
        inkluderteDelmaler: mellomlagredeInkluderteDelmaler = undefined,
        fritekst: mellomlagredeFritekstfelt = undefined,
        valgfelt: mellomlagredeValgfelt = undefined,
        variabler: mellomlagredeVariabler = undefined,
    } = mellomlagretBrev ? (JSON.parse(mellomlagretBrev?.brevverdier) as IBrevverdier) : {};
    return {
        mellomlagredeInkluderteDelmaler,
        mellomlagredeFritekstfelt,
        mellomlagredeValgfelt,
        mellomlagredeVariabler,
    };
}
