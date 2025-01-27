import { v4 as uuidv4 } from 'uuid';

import { tilPeriodeMedEndretKey, PeriodeMedEndretKey, Periode } from '../../../../utils/periode';

export const initialiserVedtaksperioder = (
    vedtaksperioder: Periode[] | undefined
): PeriodeMedEndretKey[] => {
    const perioderMedEndretKey = vedtaksperioder && tilPeriodeMedEndretKey(vedtaksperioder);

    return perioderMedEndretKey ?? [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): PeriodeMedEndretKey => ({
    fom: '',
    tom: '',
    endretKey: uuidv4(),
});
