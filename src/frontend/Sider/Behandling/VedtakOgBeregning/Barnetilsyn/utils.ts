import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import { InnvilgeBarnetilsynRequest } from '../../../../typer/vedtak/vedtakTilsynBarn';

export const lagVedtakRequest = (): InnvilgeBarnetilsynRequest => {
    return { type: TypeVedtak.INNVILGELSE };
};
