import React, { FC, Fragment } from 'react';

import { styled } from 'styled-components';

import { BusIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label, Tag, VStack } from '@navikt/ds-react';

import { LesevisningFaktaDagligReise } from './LesevisningFaktaDagligReise';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import { formaterNullablePeriode } from '../../../../../utils/dato';
import { VilkårsresultatTilTekst } from '../../../Inngangsvilkår/Vilkårperioder/VilkårperiodeKort/tekstmapping';
import {
    regelIdTilSpørsmålKortversjon,
    svarIdTilTekstKorversjon,
} from '../../../Vilkårvurdering/tekster';
import { typeDagligReiseTilTekst, VilkårDagligReise } from '../typer/vilkårDagligReise';

const Redigeringsknapp = styled(SmallButton)`
    max-height: 24px;
    align-self: end;
`;

const LesevisningVilkårDagligReise: FC<{
    vilkår: VilkårDagligReise;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
    vilkårIndex: number;
}> = ({ vilkår, vilkårIndex, startRedigering, skalViseRedigeringsknapp }) => {
    const { resultat, delvilkårsett, fom, tom, fakta } = vilkår;

    return (
        <ResultatOgStatusKort
            periode={vilkår}
            redigeringKnapp={
                skalViseRedigeringsknapp && (
                    <Redigeringsknapp
                        variant="tertiary"
                        onClick={startRedigering}
                        icon={<PencilIcon />}
                    />
                )
            }
        >
            <HGrid gap={{ md: '4', lg: '8' }} columns="minmax(auto, 234px) auto">
                <VStack gap="6">
                    <VStack gap="3">
                        <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                        <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
                        <LesevisningFaktaDagligReise fakta={fakta} />
                    </VStack>
                    {fakta && (
                        <Tag
                            size="small"
                            style={{ width: 'max-content' }}
                            variant="neutral"
                            icon={<BusIcon />}
                        >
                            {`Reise ${vilkårIndex} med ${typeDagligReiseTilTekst[fakta?.type]}`}
                        </Tag>
                    )}
                </VStack>

                <VStack gap="1">
                    {delvilkårsett.map((delvilkår, index) => (
                        <HGrid
                            gap={'1 4'}
                            columns="minmax(100px, max-content) 1fr"
                            key={index}
                            height="fit-content"
                        >
                            {delvilkår.vurderinger.map((vurdering, index) => (
                                <Fragment key={index}>
                                    <HStack gap="3" key={vurdering.regelId}>
                                        <BodyShort weight="semibold" size="small">
                                            {regelIdTilSpørsmålKortversjon[vurdering.regelId]}
                                        </BodyShort>
                                        {vurdering.svar && (
                                            <BodyShort size="small">
                                                {svarIdTilTekstKorversjon[vurdering.svar]}
                                            </BodyShort>
                                        )}
                                    </HStack>
                                    <BodyShort size="small">{vurdering.begrunnelse}</BodyShort>
                                    {delvilkår.vurderinger.length > 1 && (
                                        <Skillelinje style={{ gridColumn: 'span 2' }} />
                                    )}
                                </Fragment>
                            ))}
                        </HGrid>
                    ))}
                    {vilkår.slettetKommentar && (
                        <HStack gap="4">
                            <Label size="small">Kommentar slettet:</Label>
                            <BodyShort size="small">{vilkår.slettetKommentar}</BodyShort>
                        </HStack>
                    )}
                </VStack>
            </HGrid>
        </ResultatOgStatusKort>
    );
};

export default LesevisningVilkårDagligReise;
