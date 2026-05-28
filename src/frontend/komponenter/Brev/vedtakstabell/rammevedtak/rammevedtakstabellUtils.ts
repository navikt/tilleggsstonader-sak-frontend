export function formaterKrVerdi(verdi: string | number, bekreftet: boolean): string {
    return bekreftet ? `${verdi} kr` : `${verdi} kr*`;
}
