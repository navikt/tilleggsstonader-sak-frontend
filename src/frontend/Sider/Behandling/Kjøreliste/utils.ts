import { Dag, TypeAvvikDag, UkeStatus, UkeVurdering } from '../../../typer/kjøreliste';

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
        dag.avklartDag?.avvik.find((avvik) => avvik === TypeAvvikDag.FOR_HØY_PARKERINGSUTGIFT) !==
        undefined
    );
}
