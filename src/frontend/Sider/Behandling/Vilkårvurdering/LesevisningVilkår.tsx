import React, { FC } from 'react';

import { styled } from 'styled-components';

import { regelIdTilSpørsmål, svarIdTilTekst } from './tekster';
import { delvilkårSomSkalVises } from './utils';
import Lesefelt from '../../../komponenter/Skjema/Lesefelt';
import { Vilkår } from '../vilkår';

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
`;

const Svar = styled(Lesefelt)`
    grid-column: 1;
`;

const Begrunnelse = styled(Lesefelt)`
    grid-column: 2;
`;
const LesevisningVilkår: FC<{
    vilkår: Vilkår;
}> = ({ vilkår }) => {
    return (
        <Grid>
            {delvilkårSomSkalVises(vilkår.vurdering).map(([regelId, delvilkårsvurdering]) => {
                const svar = delvilkårsvurdering.svar;
                const begrunnelse = delvilkårsvurdering.begrunnelse;

                return (
                    <React.Fragment key={regelId}>
                        <Svar
                            key={regelId}
                            label={regelIdTilSpørsmål[regelId]}
                            verdi={(svar && svarIdTilTekst[svar]) || '-'}
                        />
                        {begrunnelse && <Begrunnelse label={'Begrunnelse'} verdi={begrunnelse} />}
                    </React.Fragment>
                );
            })}
        </Grid>
    );
};

export default LesevisningVilkår;
