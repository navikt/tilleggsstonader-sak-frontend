import React, { FC } from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label, Tag, VStack } from '@navikt/ds-react';

import LesevisningFremtidigUtgift from './LesevisningFremtidigUtgift';
import styles from './LesevisningVilkår.module.css';
import { skalFåDekketFaktiskeUtgifter } from './utils';
import { Vurderingsrad } from './Vurderingsrad';
import SmallButton from '../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../komponenter/Skillelinje';
import { formaterNullablePeriode } from '../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';
import { VilkårsresultatTilTekst } from '../Inngangsvilkår/Vilkårperioder/VilkårperiodeKort/tekstmapping';
import { Vilkår } from '../vilkår';

const LesevisningVilkår: FC<{
    vilkår: Vilkår;
    skalViseRedigeringsknapp?: boolean;
    startRedigering?: () => void;
}> = ({ vilkår, startRedigering, skalViseRedigeringsknapp }) => {
    const { resultat, delvilkårsett, fom, tom, utgift, erFremtidigUtgift } = vilkår;

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
            {erFremtidigUtgift ? (
                <LesevisningFremtidigUtgift
                    vilkår={vilkår}
                    skalViseRedigeringsknapp={skalViseRedigeringsknapp}
                    startRedigering={startRedigering}
                />
            ) : (
                <HGrid gap={{ md: 'space-16', lg: 'space-32' }} columns="minmax(auto, 175px) auto">
                    <VStack gap="space-12">
                        <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                        <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
                        <BodyShort size="small">
                            {`kr ${formaterTallMedTusenSkilleEllerStrek(utgift)}`}
                        </BodyShort>
                        {skalFåDekketFaktiskeUtgifter(vilkår) && (
                            <Tag variant="alt1" size={'xsmall'} style={{ maxWidth: 'fit-content' }}>
                                Faktiske utgifter
                            </Tag>
                        )}
                    </VStack>
                    <VStack gap="space-4">
                        <HGrid gap={'space-4 space-16'} columns="minmax(100px, max-content) 1fr">
                            {!erFremtidigUtgift &&
                                delvilkårsett.map((delvilkår, index) => (
                                    <React.Fragment key={index}>
                                        <Vurderingsrad delvilkår={delvilkår} />
                                        {index !== delvilkårsett.length - 1 && (
                                            <Skillelinje style={{ gridColumn: 'span 2' }} />
                                        )}
                                    </React.Fragment>
                                ))}
                        </HGrid>
                        {vilkår.slettetKommentar && (
                            <>
                                <Skillelinje />
                                <HStack gap="space-16">
                                    <Label size="small">Begrunnelse for sletting:</Label>
                                    <BodyShort size="small">{vilkår.slettetKommentar}</BodyShort>
                                </HStack>
                            </>
                        )}
                    </VStack>
                </HGrid>
            )}
        </ResultatOgStatusKort>
    );
};

export default LesevisningVilkår;
