import { Inngangsvilkår, Vilkår, Vilkårsresultat } from '../Sider/Behandling/vilkår';

export const aktivitetVilkårMock: Vilkår = {
    id: 'id',
    behandlingId: 'behandlingId',
    resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
    vilkårtype: Inngangsvilkår.AKTIVITET,
    endretAv: 'saksbehandler',
    endretTid: '2023-01-01',
    delvilkårsett: [
        {
            resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
            vurderinger: [{ regelId: 'ER_AKTIVITET_REGISTRERT' }],
        },
    ],
};

export const målgruppeVilkårMock: Vilkår = {
    id: 'id',
    behandlingId: 'behandlingId',
    resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
    vilkårtype: Inngangsvilkår.MÅLGRUPPE,
    endretAv: 'saksbehandler',
    endretTid: '2023-01-01',
    delvilkårsett: [
        {
            resultat: Vilkårsresultat.IKKE_TATT_STILLING_TIL,
            vurderinger: [{ regelId: 'MÅLGRUPPE' }],
        },
    ],
};
