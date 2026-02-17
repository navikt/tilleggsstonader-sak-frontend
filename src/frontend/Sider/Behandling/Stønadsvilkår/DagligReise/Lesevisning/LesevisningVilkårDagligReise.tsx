import React, { FC, Fragment } from 'react';

import { BusIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label, Tag, VStack } from '@navikt/ds-react';

import { LesevisningFaktaDagligReise } from './LesevisningFaktaDagligReise';
import styles from './LesevisningVilkårDagligReise.module.css';
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

const LesevisningVilkårDagligReise: FC<{
    vilkår: VilkårDagligReise;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår, startRedigering, skalViseRedigeringsknapp }) => {
    const { resultat, delvilkårsett, fom, tom, adresse, fakta } = vilkår;

    return (
        <ResultatOgStatusKort
            periode={vilkår}
            redigeringKnapp={
                skalViseRedigeringsknapp && (
                    <SmallButton
                        className={styles.redigeringsknapp}
                        variant="tertiary"
                        onClick={startRedigering}
                        icon={<PencilIcon />}
                    />
                )
            }
        >
            <HGrid gap={{ md: 'space-16', lg: 'space-32' }} columns="minmax(auto, 234px) auto">
                <VStack gap="space-24">
                    <VStack gap="space-12">
                        <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                        <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
                        <LesevisningFaktaDagligReise fakta={fakta} />
                    </VStack>
                    {fakta.type !== 'UBESTEMT' && (
                        <Tag
                            size="small"
                            style={{ width: 'max-content' }}
                            variant="neutral"
                            icon={<BusIcon />}
                        >
                            {typeDagligReiseTilTekst[fakta?.type]}
                        </Tag>
                    )}
                </VStack>

                <VStack gap="space-4">
                    <>
                        <BodyShort size="small">
                            <strong>Adresse aktivitet:</strong> {adresse || '-'}
                        </BodyShort>
                        <Skillelinje />
                    </>
                    {delvilkårsett.map((delvilkår, index) => (
                        <HGrid
                            gap={'space-4 space-16'}
                            columns="minmax(100px, max-content) 1fr"
                            key={index}
                            height="fit-content"
                        >
                            {delvilkår.vurderinger.map((vurdering, index) => (
                                <Fragment key={index}>
                                    <HStack gap="space-12" key={vurdering.regelId}>
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
                        <HStack gap="space-16">
                            <Label size="small">Begrunnelse for sletting:</Label>
                            <BodyShort size="small">{vilkår.slettetKommentar}</BodyShort>
                        </HStack>
                    )}
                </VStack>
            </HGrid>
        </ResultatOgStatusKort>
    );
};

export default LesevisningVilkårDagligReise;
