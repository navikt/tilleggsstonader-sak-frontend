import {
    RedigerbarAvklartDag,
    Dag,
    GodkjentGjennomførtKjøring,
    TypeAvvikDag,
    TypeAvvikUke,
    UkeVurdering,
} from '../../../typer/kjøreliste';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../typer/vedtak/vedtakDagligReise';
import { perioderOverlapper } from '../../../utils/dato';

export function finnDelperiodeForUke(
    delperioder: RammeForReiseMedPrivatBilDelperiode[],
    uke: UkeVurdering
): RammeForReiseMedPrivatBilDelperiode {
    const delperiode = delperioder.find((d) =>
        perioderOverlapper(d, { fom: uke.fraDato, tom: uke.tilDato })
    );
    if (!delperiode) {
        throw new Error(`Fant ingen delperiode for uke ${uke.ukenummer}`);
    }
    return delperiode;
}

export function harAvvikPåParkeringsutgift(dag: Dag): boolean {
    return (
        dag.avklartDag?.avvik?.find((avvik) => avvik === TypeAvvikDag.FOR_HØY_PARKERINGSUTGIFT) !==
        undefined
    );
}

export function harAvvikPåHellidagEllerHelg(dag: Dag): boolean {
    return (
        dag.avklartDag?.avvik?.find((avvik) => avvik === TypeAvvikDag.HELLIDAG_ELLER_HELG) !==
        undefined
    );
}

export const tomRedigerbarAvklartDag = (dato: string): RedigerbarAvklartDag => ({
    dato: dato,
    godkjentGjennomførtKjøring: GodkjentGjennomførtKjøring.IKKE_VURDERT,
});

export const mapTilRedigerbareAvklarteDager = (dager: Dag[]): RedigerbarAvklartDag[] =>
    dager.map((dag) => ({
        dato: dag.dato,
        godkjentGjennomførtKjøring:
            dag.avklartDag?.godkjentGjennomførtKjøring || GodkjentGjennomførtKjøring.IKKE_VURDERT,
        parkeringsutgift: dag.avklartDag?.parkeringsutgift,
        begrunnelse: dag.avklartDag?.begrunnelse,
    }));

export const typeAvvikTilTekst: Record<TypeAvvikUke, string> = {
    [TypeAvvikUke.FLERE_REISEDAGER_ENN_I_RAMMEVEDTAK]:
        'Flere innsendte reisedager enn i rammevedtak',
};

export const godkjentGjennomførtKjøringTilTekst: Record<GodkjentGjennomførtKjøring, string> = {
    [GodkjentGjennomførtKjøring.JA]: 'Dekkes',
    [GodkjentGjennomførtKjøring.NEI]: 'Dekkes ikke',
    [GodkjentGjennomførtKjøring.IKKE_VURDERT]: 'Ikke vurdert',
};
