import { InnvilgeBarnetilsynRequest, TypeVedtak } from '../../../../typer/vedtak';

export const lagVedtakRequest = (): InnvilgeBarnetilsynRequest => {
    return { type: TypeVedtak.INNVILGELSE };
};
