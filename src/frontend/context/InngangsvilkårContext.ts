import { useState } from 'react';

import constate from 'constate';

import { defaultMålgruppeStateMock } from '../Sider/Behandling/Inngangsvilkår/mockUtils';
import { Vilkår } from '../Sider/Behandling/vilkår';

export interface UseInngangsvilkår {
    målgrupper: Målgruppe[];
    settMålgrupper: React.Dispatch<React.SetStateAction<Målgruppe[]>>;
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

export const [InngangsvilkårProvider, useInngangsvilkår] = constate((): UseInngangsvilkår => {
    const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(defaultMålgruppeStateMock);

    return { målgrupper, settMålgrupper };
});
