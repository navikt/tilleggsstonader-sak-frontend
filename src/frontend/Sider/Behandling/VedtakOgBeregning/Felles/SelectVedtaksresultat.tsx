import React, { FC } from 'react';

import { styled } from 'styled-components';

import { Heading } from '@navikt/ds-react';

import { useSteg } from '../../../../context/StegContext';
import Select from '../../../../komponenter/Skjema/Select';
import {
    BehandlingResultat,
    behandlingResultatTilTekst,
} from '../../../../typer/behandling/behandlingResultat';

const Container = styled.div`
    width: max-content;
`;
interface Props {
    resultatType?: BehandlingResultat;
    settResultatType: (val: BehandlingResultat | undefined) => void;
}

const SelectVedtaksresultat: FC<Props> = ({ resultatType, settResultatType }) => {
    const { erStegRedigerbart } = useSteg();
    // const { settIkkePersistertKomponent } = useApp();

    return (
        <Container>
            <Heading spacing size="small">
                Vedtaksresultat
            </Heading>
            <Select
                erLesevisning={!erStegRedigerbart}
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
                size="small"
            >
                <option value="">Velg</option>
                <option value={BehandlingResultat.INNVILGET}>Innvilge</option>
            </Select>
        </Container>
    );
};

export default SelectVedtaksresultat;
