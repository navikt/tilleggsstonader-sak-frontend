export type SvarJaNei = 'JA' | 'NEI';

export interface NødvendigUtgift {
    erUtgiftenNødvendig: SvarJaNei;
    begrunnelse?: string | null;
}

export const erSvarJaNei = (svarId: string): svarId is SvarJaNei =>
    svarId === 'JA' || svarId === 'NEI';
