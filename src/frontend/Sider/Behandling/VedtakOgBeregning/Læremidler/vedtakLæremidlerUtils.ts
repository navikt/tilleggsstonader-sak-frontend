import { v4 as uuidv4 } from 'uuid';

import { InnvilgelseLæremidler } from '../../../../typer/vedtak/vedtakLæremidler';
import {
    tilPeriodeMedEndretKey,
    PeriodeMedEndretKey,
    Periode,
    validerPeriode,
} from '../../../../utils/periode';
import { FormErrors } from '../../../../hooks/felles/useFormState';

export const initialiserVedtaksperioder = (
    vedtak: InnvilgelseLæremidler | undefined
): { [k: string]: PeriodeMedEndretKey } => {
    const perioderMedEndretKey =
        vedtak?.vedtaksperioder && tilPeriodeMedEndretKey(vedtak?.vedtaksperioder);

    if (perioderMedEndretKey) {
        return perioderMedEndretKey.reduce<{ [k: string]: PeriodeMedEndretKey }>(
            (acc, periode) => {
                acc[periode.endretKey] = periode;
                return acc;
            },
            {}
        );
    } else {
        const tomVedtaksperiode = lagTomVedtaksperiode();
        return { [tomVedtaksperiode.endretKey]: tomVedtaksperiode };
    }
};

export const vedtaksperiodeRecordTilListe = (vedtaksperioder: {[k: string]: PeriodeMedEndretKey}): PeriodeMedEndretKey[] => {
    return Object.values(vedtaksperioder)
}

export const lagTomVedtaksperiode = (): PeriodeMedEndretKey => ({
    fom: '',
    tom: '',
    endretKey: uuidv4(),
});
