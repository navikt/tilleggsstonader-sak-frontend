import { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { SluttdatoForForrigeVedtak } from '../../../../typer/behandling/behandling';
import { nullableTilDato, tilDato } from '../../../../utils/dato';
import { Toggle } from '../../../../utils/toggles';

export type Periode = {
    fom?: string;
    tom?: string;
};

export const useHarEndretDatoerFørTidligereVedtak = ({
    tidligere,
    ny,
}: {
    tidligere: Periode | undefined;
    ny: Periode;
}) => {
    const [visBekreftModal, settVisBekreftModal] = useState<boolean>(false);
    const { sluttDatoForrigeVedtak } = useBehandling();
    const erAktivert = useFlag(Toggle.VIS_VARSEL_ENDRING_AV_PERIODE);
    const burdeViseModal = burdeViseBekreftEndringIPeriodeModal(
        tidligere,
        ny,
        sluttDatoForrigeVedtak
    );
    return {
        visBekreftModal,
        settVisBekreftModal,
        burdeViseModal: erAktivert ? burdeViseModal : false,
    };
};

export const useSlettePeriodeFørTidligereVedtak = ({ tidligere }: { tidligere: Periode }) => {
    const [visBekreftModal, settVisBekreftModal] = useState<boolean>(false);

    const { sluttDatoForrigeVedtak } = useBehandling();
    const erAktivert = useFlag(Toggle.VIS_VARSEL_ENDRING_AV_PERIODE);

    const burdeViseModal =
        sluttDatoForrigeVedtak.sluttdato &&
        tidligere.fom &&
        tilDato(sluttDatoForrigeVedtak.sluttdato) > tilDato(tidligere.fom);

    return {
        visBekreftModal,
        settVisBekreftModal,
        burdeViseModal: erAktivert ? burdeViseModal : false,
    };
};

export const burdeViseBekreftEndringIPeriodeModal = (
    tidligere: Periode | undefined,
    ny: Periode,
    sluttdatoForForrigeVedtak: SluttdatoForForrigeVedtak
): boolean => {
    const forrigeVedtakTom = sluttdatoForForrigeVedtak.sluttdato;
    const tidligereFom = tidligere?.fom;
    const tidligereTom = tidligere?.tom;
    const { fom, tom } = ny;
    if (!forrigeVedtakTom || !fom || !tom) {
        return false;
    }
    const forrigeVedtakTomDato = tilDato(forrigeVedtakTom);

    return (
        harEndretDatoetFørTidligereVedtak(tidligereFom, fom, forrigeVedtakTomDato) ||
        harEndretDatoetFørTidligereVedtak(tidligereTom, tom, forrigeVedtakTomDato)
    );
};

const harEndretDatoetFørTidligereVedtak = (
    tidligere: string | undefined,
    ny: string,
    tidligereVedtak: Date
) => {
    if (tidligere === ny) {
        return false;
    }
    const nyDato = tilDato(ny);
    if (nyDato < tidligereVedtak) {
        return true;
    }
    const tidligereDato = nullableTilDato(tidligere);
    // noinspection RedundantIfStatementJS
    if (tidligereDato && tidligereDato < tidligereVedtak) {
        return true;
    }
    return false;
};
