import { v4 as uuidv4 } from 'uuid';

import { InnvilgeVedtakForm } from './InnvilgeVedtak/InnvilgeBarnetilsyn';
import { FormState } from '../../../../hooks/felles/useFormState';
import { InnvilgeBarnetilsynRequest, Utgift } from '../../../../typer/vedtak';
import { GrunnlagBarn } from '../../vilkår';

export const tomUtgiftPerBarn = (barnIBehandling: GrunnlagBarn[]): Record<string, Utgift[]> =>
    barnIBehandling.reduce((acc, barn) => {
        return { ...acc, [barn.barnId]: [tomUtgiftRad()] };
    }, {});

export const tomUtgiftRad = (): Utgift => ({
    fom: '',
    tom: '',
    endretKey: uuidv4(),
});

/**
 * Legger på endretKey sånn at hver rad har en unik id
 * Hvis ikke blir ikke renderingen riktig når man fjerner en rad
 */
export const medEndretKey = (utgifter: Utgift[]) =>
    utgifter.map((utgift) => ({ ...utgift, endretKey: uuidv4() }));

export const leggTilTomRadUnderIListe = <T>(liste: T[], nyRad: T, indeks: number): T[] => {
    return [...liste.slice(0, indeks + 1), nyRad, ...liste.slice(indeks + 1, liste.length)];
};

export const lagVedtakRequest = (
    form: FormState<InnvilgeVedtakForm>
): InnvilgeBarnetilsynRequest => {
    return {
        utgifter: form.utgifter,
    };
};
