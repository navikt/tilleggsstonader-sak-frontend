import { v4 as uuidv4 } from 'uuid';

import {
    Aktivitet,
    AktivitetType,
    Målgruppe,
    MålgruppeType,
} from '../../../context/InngangsvilkårContext';
import { Inngangsvilkårtype, Vilkår, Vilkårsresultat } from '../vilkår';

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

export const defaultMålgruppeStateMock: Målgruppe[] = [
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
];

export const opprettVilkårTiltak = (): Vilkår => {
    return {
        id: 'ece4a22d-a2ce-4b06-89c5-9475aaafbe52',
        behandlingId: 'a2623609-0869-43eb-a255-55ebb185e835',
        resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
        vilkårType: Inngangsvilkårtype.AKTIVITET_TILTAK,
        barnId: undefined,
        endretAv: 'Z994808',
        endretTid: '2023-12-01T09:56:31.631',
        delvilkårsett: [
            {
                resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
                vurderinger: [
                    {
                        regelId: 'LØNN_GJENNOM_TILTAK',
                        svar: undefined,
                        begrunnelse: undefined,
                    },
                ],
            },
            {
                resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
                vurderinger: [
                    {
                        regelId: 'MOTTAR_SYKEPENGER_GJENNOM_AKTIVITET',
                        svar: undefined,
                        begrunnelse: undefined,
                    },
                ],
            },
        ],
        opphavsvilkår: undefined,
    };
};

export const opprettVilkårUtdanning = (): Vilkår => {
    return {
        id: '13109d3d-891e-45d5-9283-f2a9f47e521d',
        behandlingId: 'a2623609-0869-43eb-a255-55ebb185e835',
        resultat: Vilkårsresultat.OPPFYLT,
        vilkårType: Inngangsvilkårtype.AKTIVITET_UTDANNING,
        barnId: undefined,
        endretAv: 'Z994808',
        endretTid: '2023-12-01T10:07:55.663',
        delvilkårsett: [],
        opphavsvilkår: undefined,
    };
};

export const defaultAktivitetStateMock: Aktivitet[] = [
    {
        id: '1',
        fom: '2023-01-01',
        tom: '2023-12-31',
        type: AktivitetType.TILTAK,
        vilkår: opprettVilkårTiltak(),
    },
];
