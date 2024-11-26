import { useApp } from '../context/AppContext';
import { EndreAktivitetFormBarnetilsyn } from '../Sider/Behandling/Inngangsvilkår/Aktivitet/EndreAktivitetBarnetilsyn';
import { EndreAktivitetFormLæremidler } from '../Sider/Behandling/Inngangsvilkår/Aktivitet/EndreAktivitetLæremidler';
import { EndreMålgruppeForm } from '../Sider/Behandling/Inngangsvilkår/Målgruppe/EndreMålgruppeRad';
import {
    Aktivitet,
    AktivitetType,
    FaktaOgVurderingerAktivitet,
} from '../Sider/Behandling/Inngangsvilkår/typer/aktivitet';
import {
    FaktaOgVurderingerMålgruppe,
    Målgruppe,
    MålgruppeType,
} from '../Sider/Behandling/Inngangsvilkår/typer/målgruppe';
import { LagreVilkårperiodeResponse } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode';
import { RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { Periode } from '../utils/periode';

export interface LagreVilkårperiode extends Periode {
    behandlingId: string;
    type: AktivitetType | MålgruppeType | '';
    faktaOgVurderinger: FaktaOgVurderinger;
    begrunnelse?: string;
    kildeId?: string;
}

type FaktaOgVurderinger = FaktaOgVurderingerMålgruppe | FaktaOgVurderingerAktivitet;

type VilkårperiodeForm =
    | EndreMålgruppeForm
    | EndreAktivitetFormBarnetilsyn
    | EndreAktivitetFormLæremidler;

export const useLagreVilkårperiode = () => {
    const { request } = useApp();

    const lagreVilkårperiode = <T extends Målgruppe | Aktivitet>(
        behandlingId: string,
        form: VilkårperiodeForm,
        faktaOgVurderinger: FaktaOgVurderinger,
        vilkårperiodeId?: string
    ) => {
        const vilkårperiode = mapFormTilRequest(behandlingId, form, faktaOgVurderinger);

        if (vilkårperiodeId) {
            return oppdaterVilkårperiode<T>(vilkårperiode, vilkårperiodeId);
        } else {
            return opprettVilkårperiode<T>(vilkårperiode);
        }
    };

    const oppdaterVilkårperiode = async <T extends Målgruppe | Aktivitet>(
        vilkårperiode: LagreVilkårperiode,
        lagretPeriodeId: string
    ): Promise<RessursSuksess<LagreVilkårperiodeResponse<T>> | RessursFeilet> => {
        return await request<LagreVilkårperiodeResponse<T>, LagreVilkårperiode>(
            `/api/sak/vilkarperiode/v2/${lagretPeriodeId}`,
            'POST',
            vilkårperiode
        );
    };

    const opprettVilkårperiode = async <T extends Målgruppe | Aktivitet>(
        vilkårperiode: LagreVilkårperiode
    ): Promise<RessursSuksess<LagreVilkårperiodeResponse<T>> | RessursFeilet> => {
        return await request<LagreVilkårperiodeResponse<T>, LagreVilkårperiode>(
            `/api/sak/vilkarperiode/v2`,
            'POST',
            vilkårperiode
        );
    };

    const mapFormTilRequest = (
        behandlingId: string,
        form: VilkårperiodeForm,
        faktaOgVurderinger: FaktaOgVurderinger
    ): LagreVilkårperiode => ({
        fom: form.fom,
        tom: form.tom,
        behandlingId: behandlingId,
        type: form.type,
        faktaOgVurderinger: faktaOgVurderinger,
        begrunnelse: form.begrunnelse,
        kildeId: 'kildeId' in form ? form.kildeId : undefined,
    });

    return {
        lagreVilkårperiode,
    };
};
