import { FaktaDagligReise } from './faktaDagligReise';
import { RegelIdDagligReise } from './regelstrukturDagligReise';
import { SvarId } from '../../../../../typer/regel';
import { Periode } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';
import { PeriodeStatus } from '../../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Delvilkår, Vilkårsresultat } from '../../../vilkår';

export interface VilkårDagligReise extends Periode {
    id: string;
    behandlingId: string;
    resultat: Vilkårsresultat;
    status: PeriodeStatus;
    delvilkårsett: Delvilkår[];
    fakta?: FaktaDagligReise;
}

export interface SlettDagligReiseVilkårRespons {
    slettetPermanent: boolean;
    vilkår: VilkårDagligReise;
}

export type TypeDagligReise = 'OFFENTLIG_TRANSPORT' | 'PRIVAT_BIL';

export const typeDagligReiseTilTekst: Record<TypeDagligReise, string> = {
    OFFENTLIG_TRANSPORT: 'Offentlig transport',
    PRIVAT_BIL: 'Privat bil',
};

export interface SvarOgBegrunnelse {
    svarId: SvarId;
    begrunnelse: string | undefined;
}

export type SvarVilkårDagligReise = Record<RegelIdDagligReise, SvarOgBegrunnelse | undefined>;

export interface LagreNyttVilkårDagligReise {
    fom: string;
    tom: string;
    svar: SvarVilkårDagligReise;
    fakta?: FaktaDagligReise;
}

export interface OppdaterVilkårDagligReise extends LagreNyttVilkårDagligReise {
    id: string; // id på vilkåret som skal oppdateres
}
