import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { VedtakValg } from './vurderingValg';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import { Vurderingsfelter } from './vurderingsfelter';

const VedtakStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const VedtakInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IVedtak {
    settVedtak: Dispatch<SetStateAction<Vurderingsfelter>>;
    vedtakValgt?: VedtakValg;
    vedtakValgmuligheter: Record<string, string>;
    endring: (komponentId: string) => void;
}

export const Vedtak: React.FC<IVedtak> = ({
    settVedtak,
    vedtakValgt,
    vedtakValgmuligheter,
    endring,
}) => {
    const oppdaterVedtak = (nyttValg: string) => {
        settVedtak(
            (tidligereTilstand: Vurderingsfelter) =>
                ({
                    ...tidligereTilstand,
                    vedtak: nyttValg,
                    årsak: undefined,
                    hjemmel: undefined,
                }) as Vurderingsfelter
        );
    };

    const { settVurderingEndret } = useKlagebehandling();
    return (
        <VedtakStyled>
            <Heading spacing size="medium" level="5">
                Vedtak
            </Heading>
            <VedtakInnholdStyled>
                <Select
                    value={vedtakValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        oppdaterVedtak(e.target.value);
                        settVurderingEndret(true);
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.keys(vedtakValgmuligheter).map((valg, index) => (
                        <option value={valg} key={index}>
                            {vedtakValgmuligheter[valg]}
                        </option>
                    ))}
                </Select>
            </VedtakInnholdStyled>
        </VedtakStyled>
    );
};
