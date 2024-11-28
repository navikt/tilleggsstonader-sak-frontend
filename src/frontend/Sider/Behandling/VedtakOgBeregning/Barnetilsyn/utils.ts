import { InnvilgeBarnetilsynRequest, TypeVedtak } from '../../../../typer/vedtak/vedtakTilsynBarn';

export const lagVedtakRequest = (): InnvilgeBarnetilsynRequest => {
    return { type: TypeVedtak.INNVILGELSE };
};
