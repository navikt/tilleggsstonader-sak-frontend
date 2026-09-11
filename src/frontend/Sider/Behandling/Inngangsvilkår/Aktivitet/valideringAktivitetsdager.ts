import { harTallverdi } from '../../../../utils/tall';

export function aktivitetsdagerErGyldigTall(aktivitetsdager: number | undefined): boolean {
    return harTallverdi(aktivitetsdager) && aktivitetsdager >= 1 && aktivitetsdager <= 5;
}
