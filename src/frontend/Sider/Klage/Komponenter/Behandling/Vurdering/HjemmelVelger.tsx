import * as React from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { IVurdering } from './vurderingValg';
import {
    Hjemmel,
    alleHjemlerTilVisningstekst,
    folketrygdlovenHjemmelTilVisningstekst,
} from './hjemmel';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursStatus } from '../../../App/typer/ressurs';
import { Stønadstype } from '../../../App/typer/stønadstype';

const HjemmelStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const HjemmelInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IHjemmel {
    settHjemmel: Dispatch<SetStateAction<IVurdering>>;
    hjemmelValgt?: Hjemmel;
    endring: (komponentId: string) => void;
}

export const HjemmelVelger: React.FC<IHjemmel> = ({ settHjemmel, hjemmelValgt, endring }) => {
    const { behandling, settVurderingEndret } = useBehandling();
    const hjemmelValgmuligheter: Record<string, string> = React.useMemo(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            switch (behandling.data.stønadstype) {
                case Stønadstype.BARNETILSYN:
                case Stønadstype.OVERGANGSSTØNAD:
                case Stønadstype.SKOLEPENGER:
                    return folketrygdlovenHjemmelTilVisningstekst;
                default:
                    return alleHjemlerTilVisningstekst;
            }
        }
        return alleHjemlerTilVisningstekst;
    }, [behandling]);
    return (
        <HjemmelStyled>
            <Heading spacing size="medium" level="5">
                Hjemmel
            </Heading>
            <HjemmelInnholdStyled>
                <Select
                    value={hjemmelValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        settHjemmel(
                            (tidligereTilstand: IVurdering) =>
                                ({
                                    ...tidligereTilstand,
                                    hjemmel: e.target.value,
                                }) as IVurdering
                        );
                        settVurderingEndret(true);
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.keys(hjemmelValgmuligheter).map((nøkkel, index) => (
                        <option value={nøkkel} key={index}>
                            {hjemmelValgmuligheter[nøkkel]}
                        </option>
                    ))}
                </Select>
            </HjemmelInnholdStyled>
        </HjemmelStyled>
    );
};
