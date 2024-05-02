import React, { FC } from 'react';

import { styled } from 'styled-components';

import { Heading } from '@navikt/ds-react';

import { useSteg } from '../../../../context/StegContext';
import Select from '../../../../komponenter/Skjema/Select';
import { behandlingResultatTilTekst } from '../../../../typer/behandling/behandlingResultat';
import { TypeVedtak } from '../../../../typer/vedtak';

const Container = styled.div`
    width: max-content;
`;
interface Props {
    resultatVedtak?: TypeVedtak;
    settResultatVedtak: (val: TypeVedtak | undefined) => void;
}

const SelectVedtaksresultat: FC<Props> = ({
    resultatVedtak: resultatType,
    settResultatVedtak: settResultatType,
}) => {
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
                        e.target.value === '' ? undefined : (e.target.value as TypeVedtak);
                    settResultatType(vedtaksresultat);
                    // settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                }}
                lesevisningVerdi={resultatType && behandlingResultatTilTekst[resultatType]}
                size="small"
            >
                <option value="">Velg</option>
                <option value={TypeVedtak.INNVILGET}>Innvilge</option>
                <option value={TypeVedtak.AVSLÅTT}>Avslå</option>
            </Select>
        </Container>
    );
};

export default SelectVedtaksresultat;
