import { Mappe } from '../../Oppgavebenk/typer/oppgave';

export const mapperTilIdRecord = (mapper: Mappe[]): Record<number, Mappe> =>
    mapper.reduce(
        (acc, item) => {
            acc[item.id] = item;
            return acc;
        },
        {} as Record<number, Mappe>
    );

export const mappeIdTilMappenavn = (
    mappeId: number | 0 | undefined,
    mapper: Record<number, Mappe>
) => {
    if (mappeId === 0 || mappeId === undefined) {
        return;
    }
    return mapper[mappeId]?.navn ?? 'Ukjent mappe';
};
