import React, { FC } from 'react';

import { Heading } from '@navikt/ds-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import Select from '../../../../komponenter/Skjema/Select';
import {
    BehandlingResultat,
    behandlingResultatTilTekst,
} from '../../../../typer/behandling/behandlingResultat';

interface Props {
    resultatType?: BehandlingResultat;
    settResultatType: (val: BehandlingResultat | undefined) => void;
}

const SelectVedtaksresultat: FC<Props> = ({ resultatType, settResultatType }) => {
    const { behandlingErRedigerbar } = useBehandling();
    // const { settIkkePersistertKomponent } = useApp();

    return (
        <div>
            <Heading spacing size="small">
                Vedtaksresultat
            </Heading>
            <Select
                erLesevisning={!behandlingErRedigerbar}
                label={'Vedtaksresultat'}
                hideLabel
                value={resultatType || ''}
                onChange={(e) => {
                    const vedtaksresultat =
                        e.target.value === '' ? undefined : (e.target.value as BehandlingResultat);
                    settResultatType(vedtaksresultat);
                    // settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                }}
                lesevisningVerdi={resultatType && behandlingResultatTilTekst[resultatType]}
            >
                <option value="">Velg</option>
                <option value={BehandlingResultat.INNVILGET}>Innvilge</option>
            </Select>
        </div>
    );
};

export default SelectVedtaksresultat;
