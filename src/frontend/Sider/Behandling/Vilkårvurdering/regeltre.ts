import { SvarId } from '../../../typer/regel';

interface RegelTreSvaralternativ<RegelId extends string> {
    svarId: SvarId;
    nesteRegelId?: RegelId | null;
}

interface RegelTreRegel<RegelId extends string> {
    erHovedregel: boolean;
    svaralternativer: RegelTreSvaralternativ<RegelId>[];
}

interface VurderingMedSvar {
    svar?: SvarId;
}

export function initierAktiveDelvilkår<RegelId extends string>(
    svar: Partial<Record<RegelId, VurderingMedSvar | undefined>>,
    regelstruktur: Record<RegelId, RegelTreRegel<RegelId>>
): RegelId[] {
    const regeloppføringer = Object.entries(regelstruktur) as [RegelId, RegelTreRegel<RegelId>][];
    const aktive = regeloppføringer
        .filter(([, regel]) => regel.erHovedregel)
        .map(([regelId]) => regelId);
    const aktiveRegler = new Set<RegelId>();

    while (aktive.length > 0) {
        const regelId = aktive.shift();
        if (!regelId || aktiveRegler.has(regelId)) continue;
        aktiveRegler.add(regelId);

        const valgtSvar = svar[regelId]?.svar;
        const svaralternativ = regelstruktur[regelId].svaralternativer.find(
            (alternativ) => alternativ.svarId === valgtSvar
        );
        if (svaralternativ?.nesteRegelId) {
            aktive.push(svaralternativ.nesteRegelId);
        }
    }

    return [...aktiveRegler];
}
