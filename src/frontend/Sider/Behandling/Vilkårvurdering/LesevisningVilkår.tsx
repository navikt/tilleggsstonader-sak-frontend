import React, { FC } from 'react';

import { styled } from 'styled-components';

import { regelIdTilSpørsmål, svarIdTilTekst } from './tekster';
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
            {vilkår.delvilkårsett.map((delvilkår) =>
                delvilkår.vurderinger.map((svar) => (
                    <React.Fragment key={svar.regelId}>
                        <Svar
                            key={svar.regelId}
                            label={regelIdTilSpørsmål[svar.regelId]}
                            verdi={(svar.svar && svarIdTilTekst[svar.svar]) || '-'}
                        />
                        {svar.begrunnelse && (
                            <Begrunnelse label={'Begrunnelse'} verdi={svar.begrunnelse} />
                        )}
                    </React.Fragment>
                ))
            )}
        </Grid>
    );
};

export default LesevisningVilkår;
