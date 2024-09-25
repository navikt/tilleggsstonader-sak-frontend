import React, { FC } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { HStack } from '@navikt/ds-react';
import { AShadowXsmall } from '@navikt/ds-tokens/dist/tokens';

import { regelIdTilSpørsmål, svarIdTilTekst } from './tekster';
import { useBehandling } from '../../../context/BehandlingContext';
import { VilkårsresultatIkon } from '../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import Lesefelt from '../../../komponenter/Skjema/Lesefelt';
import { Statusbånd } from '../../../komponenter/Statusbånd';
import { FlexColumn } from '../../../komponenter/Visningskomponenter/Flex';
import { BehandlingType } from '../../../typer/behandling/behandlingType';
import { formaterNullableÅrMåned } from '../../../utils/dato';
import { harTallverdi } from '../../../utils/tall';
import { Toggle } from '../../../utils/toggles';
import { Vilkår } from '../vilkår';

const TwoColumnGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 2rem;
`;

const Container = styled(FlexColumn)`
    position: relative;
    background: white;
    padding: 1rem;
    box-shadow: ${AShadowXsmall};
`;

const FlexMedMargin = styled(FlexColumn)`
    margin: 0 45px;
`;

const Svar = styled(Lesefelt)`
    grid-column: 1;
`;

const Begrunnelse = styled(Lesefelt)`
    grid-column: 2;
`;

const LesevisningVilkår: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår, startRedigering, skalViseRedigeringsknapp }) => {
    const { behandling } = useBehandling();

    const { resultat, delvilkårsett, fom, tom, utgift } = vilkår;

    const skalViseStatus = useFlag(Toggle.SKAL_VISE_STATUS_PERIODER);

    return (
        <Container $gap={1}>
            {skalViseStatus && behandling.type == BehandlingType.REVURDERING && (
                <Statusbånd status={vilkår.status} />
            )}
            <HStack gap="6" align={'center'}>
                <VilkårsresultatIkon vilkårsresultat={resultat} />
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
                    verdi={harTallverdi(utgift) ? utgift : ''}
                    size={'small'}
                />
            </HStack>
            <Skillelinje />
            <FlexMedMargin>
                <TwoColumnGrid>
                    {delvilkårsett.map((delvilkår) =>
                        delvilkår.vurderinger.map((svar) => (
                            <React.Fragment key={svar.regelId}>
                                <Svar
                                    size="small"
                                    key={svar.regelId}
                                    label={regelIdTilSpørsmål[svar.regelId]}
                                    verdi={(svar.svar && svarIdTilTekst[svar.svar]) || '-'}
                                />
                                {svar.begrunnelse && (
                                    <Begrunnelse
                                        size="small"
                                        label={'Begrunnelse'}
                                        verdi={svar.begrunnelse}
                                    />
                                )}
                            </React.Fragment>
                        ))
                    )}
                </TwoColumnGrid>
                {skalViseRedigeringsknapp && (
                    <SmallButton variant="secondary" onClick={startRedigering}>
                        Rediger
                    </SmallButton>
                )}
            </FlexMedMargin>
        </Container>
    );
};

export default LesevisningVilkår;
