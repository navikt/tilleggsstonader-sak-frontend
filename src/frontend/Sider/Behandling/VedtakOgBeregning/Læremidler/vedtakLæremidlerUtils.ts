import { InnvilgelseLæremidler } from '../../../../typer/vedtak/vedtakLæremidler';
import { Periode } from '../../../../utils/periode';

export const initialiserVedtaksperioder = (
    vedtak: InnvilgelseLæremidler | undefined
): Periode[] => {
    return vedtak?.vedtaksperioder ?? [tomPeriode];
};

const tomPeriode: Periode = {
    fom: '',
    tom: '',
};
