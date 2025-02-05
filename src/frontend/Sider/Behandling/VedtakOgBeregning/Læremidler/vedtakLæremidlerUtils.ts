import { v4 as uuidv4 } from 'uuid';

import { Vedtaksperiode, VedtaksperiodeMedEndretKey } from './InnvilgeVedtak/InnvilgeLæremidler';

export const initialiserVedtaksperioder = (
    vedtaksperioder: Vedtaksperiode[] | undefined
): VedtaksperiodeMedEndretKey[] => {
    const perioderMedEndretKey = vedtaksperioder && tilVedtaksperiodeMedEndretKey(vedtaksperioder);

    return perioderMedEndretKey ?? [tomVedtaksperiode()];
};

export const tomVedtaksperiode = (): VedtaksperiodeMedEndretKey => ({
    fom: '',
    tom: '',
    id: uuidv4(),
    endretKey: uuidv4(),
});

const tilVedtaksperiodeMedEndretKey = (utgifter: Vedtaksperiode[]): VedtaksperiodeMedEndretKey[] =>
    utgifter.map((utgift) => ({ ...utgift, endretKey: uuidv4() }));
