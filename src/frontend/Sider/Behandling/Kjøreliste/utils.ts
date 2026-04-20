import {
    RedigerbarAvklartDag,
    Dag,
    GodkjentGjennomførtKjøring,
    TypeAvvikDag,
    UkeStatus,
    UkeVurdering,
    TypeAvvikUke,
} from '../../../typer/kjøreliste';

interface TagInfo {
    variant: 'success' | 'error' | 'warning' | 'neutral';
    label: string;
}

export function utledUkeTag(uke: UkeVurdering): TagInfo | undefined {
    switch (uke.status) {
        case UkeStatus.OK_AUTOMATISK:
            return { label: 'Automatisk ok', variant: 'success' };
        case UkeStatus.OK_MANUELT:
            return { label: 'Manuelt ok', variant: 'warning' };
        case UkeStatus.AVVIK:
            return { label: 'Avvik', variant: 'error' };
        case UkeStatus.IKKE_MOTTATT_KJØRELISTE:
            return undefined;
    }
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
