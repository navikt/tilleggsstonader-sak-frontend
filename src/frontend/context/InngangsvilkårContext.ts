import { useState } from 'react';

import constate from 'constate';

import {
    defaultAktivitetStateMock,
    defaultMålgruppeStateMock,
} from '../Sider/Behandling/Inngangsvilkår/mockUtils';
import { Aktivitet, Målgruppe } from '../Sider/Behandling/Inngangsvilkår/typer';

export interface UseInngangsvilkår {
    målgrupper: Målgruppe[];
    settMålgrupper: React.Dispatch<React.SetStateAction<Målgruppe[]>>;
    aktiviteter: Aktivitet[];
    settAktiviteter: React.Dispatch<React.SetStateAction<Aktivitet[]>>;
}

export const [InngangsvilkårProvider, useInngangsvilkår] = constate((): UseInngangsvilkår => {
    const [målgrupper, settMålgrupper] = useState<Målgruppe[]>(defaultMålgruppeStateMock);

    const [aktiviteter, settAktiviteter] = useState<Aktivitet[]>(defaultAktivitetStateMock);

    return { målgrupper, settMålgrupper, aktiviteter, settAktiviteter };
});
