export type KjøreavstandFormFeil = {
    fraAdresseFeil: string;
    tilAdresseFeil: string;
};

export function validerKjøreavstandForm(
    fraAdresse: string,
    tilAdresse: string
): Partial<KjøreavstandFormFeil> | undefined {
    if (fraAdresse === '') {
        return { fraAdresseFeil: 'Mangler fra adresse' };
    }
    if (tilAdresse === '') {
        return { tilAdresseFeil: 'Mangler til adresse' };
    }
}
