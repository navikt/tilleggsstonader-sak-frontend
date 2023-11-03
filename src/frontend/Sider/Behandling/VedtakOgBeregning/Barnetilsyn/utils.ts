import { v4 as uuidv4 } from 'uuid';

import { InnvilgeVedtakForm } from './InnvilgeVedtak/InnvilgeBarnetilsyn';
import { FormState } from '../../../../hooks/felles/useFormState';
import { BehandlingResultat } from '../../../../typer/behandling/behandlingResultat';
import {
    InnvilgeVedtakForBarnetilsyn,
    Stønadsperiode,
    Utgift,
    VedtakType,
} from '../../../../typer/vedtak';
import { GrunnlagBarn } from '../../vilkår';

export const tomStønadsperiodeRad = (): Stønadsperiode => ({
    fom: '',
    tom: '',
    endretKey: uuidv4(),
});

export const tomUtgiftPerBarn = (barnIBehandling: GrunnlagBarn[]): Record<string, Utgift[]> =>
    barnIBehandling.reduce((acc, barn) => {
        return { ...acc, [barn.barnId]: [tomUtgiftRad()] };
    }, {});

export const tomUtgiftRad = (): Utgift => ({
    fom: '',
    tom: '',
    endretKey: uuidv4(),
});

export const leggTilTomRadUnderIListe = <T>(liste: T[], nyRad: T, indeks: number): T[] => {
    return [...liste.slice(0, indeks + 1), nyRad, ...liste.slice(indeks + 1, liste.length)];
};

export const lagVedtakRequest = (
    form: FormState<InnvilgeVedtakForm>
): InnvilgeVedtakForBarnetilsyn => {
    return {
        stønadsperioder: form.stønadsperioder,
        utgifter: form.utgifter,
        _type: VedtakType.InnvilgelseBarnetilsyn,
        resultatType: BehandlingResultat.INNVILGET,
    };
};
