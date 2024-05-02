import React, { FC } from 'react';

import { styled } from 'styled-components';

import { Heading } from '@navikt/ds-react';

import { useSteg } from '../../../../context/StegContext';
import Select from '../../../../komponenter/Skjema/Select';
import { TypeVedtak, typeVedtakTilTekst } from '../../../../typer/vedtak';

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
                lesevisningVerdi={resultatType && typeVedtakTilTekst[resultatType]}
                size="small"
            >
                <option value="">Velg</option>
                <option value={TypeVedtak.INNVILGELSE}>Innvilge</option>
                <option value={TypeVedtak.AVSLAG}>Avslå</option>
            </Select>
        </Container>
    );
};

export default SelectVedtaksresultat;
