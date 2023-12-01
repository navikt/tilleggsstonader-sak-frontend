import { useState } from 'react';

import constate from 'constate';

import {
    defaultAktivitetStateMock,
    defaultMålgruppeStateMock,
} from '../Sider/Behandling/Inngangsvilkår/mockUtils';
import { Vilkår } from '../Sider/Behandling/vilkår';

export interface UseInngangsvilkår {
    målgrupper: Målgruppe[];
    settMålgrupper: React.Dispatch<React.SetStateAction<Målgruppe[]>>;
    aktiviteter: Aktivitet[];
    settAktiviteter: React.Dispatch<React.SetStateAction<Aktivitet[]>>;
}

export interface Målgruppe {
    id: string;
    fom: string;
    tom: string;
    type: MålgruppeType;
    vilkår: Vilkår;
}

export enum MålgruppeType {
    AAP = 'AAP',
    AAP_FERDIG_AVKLART = 'AAP_FERDIG_AVKLART',
}

export interface Aktivitet {
    id: string;
    fom: string;
    tom: string;
    type: AktivitetType;
    vilkår: Vilkår;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate((): UseInngangsvilkår => {
    const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(defaultMålgruppeStateMock);

    const [aktiviteter, settAktiviteter] = useState<Aktivitet[]>(defaultAktivitetStateMock);

    return { målgrupper, settMålgrupper, aktiviteter, settAktiviteter };
});
