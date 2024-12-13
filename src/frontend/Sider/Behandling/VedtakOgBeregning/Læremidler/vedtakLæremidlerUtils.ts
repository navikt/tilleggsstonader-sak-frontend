import { v4 as uuidv4 } from 'uuid';

import { InnvilgelseLæremidler } from '../../../../typer/vedtak/vedtakLæremidler';
import { tilPeriodeMedEndretKey, PeriodeMedEndretKey } from '../../../../utils/periode';

export const initialiserVedtaksperioder = (
    vedtak: InnvilgelseLæremidler | undefined
): PeriodeMedEndretKey[] => {
    const perioderMedEndretKey =
        vedtak?.vedtaksperioder && tilPeriodeMedEndretKey(vedtak?.vedtaksperioder);

    return perioderMedEndretKey ?? [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): PeriodeMedEndretKey => ({
    fom: '',
    tom: '',
    endretKey: uuidv4(),
});
