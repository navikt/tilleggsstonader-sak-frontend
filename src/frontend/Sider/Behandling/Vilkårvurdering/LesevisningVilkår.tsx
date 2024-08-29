import React, { FC } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { HStack } from '@navikt/ds-react';

import { regelIdTilSpørsmål, svarIdTilTekst } from './tekster';
import { useSteg } from '../../../context/StegContext';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import Lesefelt from '../../../komponenter/Skjema/Lesefelt';
import { formaterNullableÅrMåned } from '../../../utils/dato';
import { harTallverdi } from '../../../utils/tall';
import { Toggle } from '../../../utils/toggles';
import { RedigerbareVilkårfelter } from '../vilkår';

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
    redigerbareVilkårfelter: RedigerbareVilkårfelter;
    startRedigering?: () => void;
}> = ({ redigerbareVilkårfelter, startRedigering }) => {
    const { erStegRedigerbart } = useSteg();
    const periodiserteVilkårIsEnabled = useFlag(Toggle.VILKÅR_PERIODISERING);

    const { delvilkårsett, fom, tom, beløp } = redigerbareVilkårfelter;
    return (
        <>
            {periodiserteVilkårIsEnabled && (
                <HStack gap="6">
                    <Lesefelt
                        label={'Periode fra og med'}
                        verdi={formaterNullableÅrMåned(fom)}
                        size={'small'}
                    />
                    <Lesefelt
                        label={'Periode til og med'}
                        verdi={formaterNullableÅrMåned(tom)}
                        size={'small'}
                    />
                    <Lesefelt
                        label={'Månedlig utgift'}
                        verdi={harTallverdi(beløp) ? beløp : ''}
                        size={'small'}
                    />
                </HStack>
            )}
            <Grid>
                {delvilkårsett.map((delvilkår) =>
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
            {erStegRedigerbart && (
                <SmallButton variant="secondary" onClick={startRedigering}>
                    Rediger
                </SmallButton>
            )}
        </>
    );
};

export default LesevisningVilkår;
