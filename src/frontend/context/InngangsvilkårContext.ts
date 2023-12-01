import { useState } from 'react';

import constate from 'constate';
import { v4 as uuidv4 } from 'uuid';

import { Inngangsvilkårtype, Vilkår, Vilkårsresultat } from '../Sider/Behandling/vilkår';

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

export const opprettVilkårAAPFerdigAvklart = () => {
    return {
        id: uuidv4(),
        behandlingId: 'a2623609-0869-43eb-a255-55ebb185e835',
        resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
        vilkårType: Inngangsvilkårtype.MÅLGRUPPE_AAP_FERDIG_AVKLART,
        barnId: undefined,
        endretAv: 'Z994808',
        endretTid: '2023-12-01T08:56:28.749',
        delvilkårsett: [
            {
                resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
                vurderinger: [
                    {
                        regelId: 'NEDSATT_ARBEIDSEVNE',
                        svar: undefined,
                        begrunnelse: undefined,
                    },
                ],
            },
        ],
        opphavsvilkår: undefined,
    };
};

export const opprettVilkårAAP = () => {
    return {
        id: uuidv4(),
        behandlingId: '2fcf753a-8335-4707-9bd8-b3cfa75265ac',
        resultat: Vilkårsresultat.OPPFYLT,
        vilkårType: Inngangsvilkårtype.MÅLGRUPPE_AAP,
        barnId: undefined,
        endretAv: 'Z994230',
        endretTid: '2023-11-30T16:01:47.347',
        delvilkårsett: [],
        opphavsvilkår: undefined,
    };
};

export const [InngangsvilkårProvider, useInngangsvilkår] = constate((): UseInngangsvilkår => {
    const [målgrupper, settMålgrupper] = useState<Målgruppe[]>([
        {
            id: '1',
            fom: '2023-01-01',
            tom: '2023-12-31',
            type: MålgruppeType.AAP,
            vilkår: opprettVilkårAAP(),
        },
        {
            id: '1',
            fom: '2023-01-01',
            tom: '2023-12-31',
            type: MålgruppeType.AAP_FERDIG_AVKLART,
            vilkår: opprettVilkårAAPFerdigAvklart(),
        },
    ]);

    return { målgrupper, settMålgrupper };
});
