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

export interface UtgifterPerBarn {
    barnId: string;
    utgifter: Utgift[];
}

export const tomUtgiftPerBarn = (barnIBehandling: GrunnlagBarn[]): UtgifterPerBarn[] =>
    barnIBehandling.map((barn) => ({ barnId: barn.barnId, utgifter: [tomUtgiftRad()] }));

export const tomUtgiftRad = (): Utgift => ({
    fom: '',
    tom: '',
    endretKey: uuidv4(),
});

export const lagVedtakRequest = (
    form: FormState<InnvilgeVedtakForm>
): InnvilgeVedtakForBarnetilsyn => {
    return {
        stønadsperioder: form.stønadsperioder,
        utgifter: form.utgifterPerBarn.reduce(
            // @ts-ignore
            (acc, barn) => {
                acc[barn.barnId] = barn.utgifter;
                return acc;
            },
            {} as Record<string, Utgift[]>
        ),
        _type: VedtakType.InnvilgelseBarnetilsyn,
        resultatType: BehandlingResultat.INNVILGET,
    };
};
