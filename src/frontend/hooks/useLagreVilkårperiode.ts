import { useApp } from '../context/AppContext';
import { EndreAktivitetFormBarnetilsyn } from '../Sider/Behandling/Inngangsvilkår/Aktivitet/EndreAktivitetBarnetilsyn';
import { EndreAktivitetFormBoutgifter } from '../Sider/Behandling/Inngangsvilkår/Aktivitet/EndreAktivitetBoutgifter';
import { EndreAktivitetFormDagligReiseTso } from '../Sider/Behandling/Inngangsvilkår/Aktivitet/EndreAktivitetDagligReiseTso';
import { EndreAktivitetFormDagligReiseTsr } from '../Sider/Behandling/Inngangsvilkår/Aktivitet/EndreAktivitetDagligReiseTsr';
import { EndreAktivitetFormLæremidler } from '../Sider/Behandling/Inngangsvilkår/Aktivitet/EndreAktivitetLæremidler';
import { EndreMålgruppeForm } from '../Sider/Behandling/Inngangsvilkår/Målgruppe/EndreMålgruppe';
import {
    Aktivitet,
    AktivitetFaktaOgSvar,
    AktivitetType,
} from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import {
    Målgruppe,
    MålgruppeFaktaOgSvar,
    MålgruppeType,
} from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { LagreVilkårperiodeResponse } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { Periode } from '../utils/periode';

export interface LagreVilkårperiode extends Periode {
    behandlingId: string;
    type: AktivitetType | MålgruppeType | '';
    faktaOgSvar: FaktaOgSvar;
    begrunnelse?: string;
    kildeId?: string;
}

type FaktaOgSvar = MålgruppeFaktaOgSvar | AktivitetFaktaOgSvar;

type VilkårperiodeForm =
    | EndreMålgruppeForm
    | EndreAktivitetFormBarnetilsyn
    | EndreAktivitetFormLæremidler
    | EndreAktivitetFormBoutgifter
    | EndreAktivitetFormDagligReiseTso
    | EndreAktivitetFormDagligReiseTsr;

export const useLagreVilkårperiode = () => {
    const { request } = useApp();

    const lagreVilkårperiode = <T extends Målgruppe | Aktivitet>(
        behandlingId: string,
        form: VilkårperiodeForm,
        faktaOgSvar: FaktaOgSvar,
        vilkårperiodeId?: string
    ) => {
        const vilkårperiode = mapFormTilRequest(behandlingId, form, faktaOgSvar);

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
        faktaOgSvar: FaktaOgSvar
    ): LagreVilkårperiode => ({
        fom: form.fom,
        tom: form.tom,
        behandlingId: behandlingId,
        type: form.type,
        faktaOgSvar: faktaOgSvar,
        begrunnelse: form.begrunnelse,
        kildeId: 'kildeId' in form ? form.kildeId : undefined,
    });

    return {
        lagreVilkårperiode,
    };
};
