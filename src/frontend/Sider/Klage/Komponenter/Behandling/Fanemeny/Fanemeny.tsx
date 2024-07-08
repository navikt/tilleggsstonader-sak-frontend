import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { alleSider, ISide, SideNavn } from './sider';
import Fane from './Fane';
import {
    Klagebehandling,

} from '../../../typer/klagebehandling/klagebehandling';
import { useKlagebehandling } from '../../../context/KlagebehandlingContext';
import { AWhite, ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import { KlagebehandlingSteg, stegrekkefølge } from '../../../typer/klagebehandling/klagebehandlingSteg';
import { KlagebehandlingResultat } from '../../../typer/klagebehandling/klagebehandlingResultat';
import { Sticky } from '../../../../../komponenter/Visningskomponenter/Sticky';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    top: 6rem;
`;

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${ABorderStrong} solid 2px;
    background-color: ${AWhite};
`;

interface Props {
    behandling: Klagebehandling;
}

const Fanemeny: FC<Props> = ({ behandling }) => {
    const { formkravOppfylt } = useKlagebehandling();
    const faneErLåst = (side: ISide, steg: KlagebehandlingSteg): boolean => {
        if (side.navn === SideNavn.VURDERING) {
            return !formkravOppfylt;
        }
        if (side.navn === SideNavn.BREV && behandling.resultat === KlagebehandlingResultat.HENLAGT) {
            return true;
        }
        return side.rekkefølge > stegrekkefølge[steg];
    };

    return (
        <StickyMedBoxShadow>
            <StyledFanemeny>
                {alleSider.map((side, index) => (
                    <Fane
                        side={side}
                        behandlingId={behandling.id}
                        index={index}
                        deaktivert={faneErLåst(side, behandling.steg)}
                        key={index}
                    />
                ))}
            </StyledFanemeny>
        </StickyMedBoxShadow>
    );
};

export default Fanemeny;
