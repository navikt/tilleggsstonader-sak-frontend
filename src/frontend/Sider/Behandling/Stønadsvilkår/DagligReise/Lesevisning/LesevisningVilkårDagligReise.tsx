import React, { FC, Fragment, useRef } from 'react';

import { BusIcon, FilesIcon, PencilIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    ErrorMessage,
    HGrid,
    HStack,
    Label,
    Popover,
    Tag,
    VStack,
} from '@navikt/ds-react';

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
    startKopiering?: () => void;
    feilmeldingRedigering?: string;
    nullstillFeilmeldingRedigering?: () => void;
}> = ({
    vilkår,
    startRedigering,
    skalViseRedigeringsknapp,
    startKopiering,
    feilmeldingRedigering,
    nullstillFeilmeldingRedigering,
}) => {
    const { resultat, delvilkårsett, fom, tom, adresse, fakta } = vilkår;
    const buttonRowRef = useRef<HTMLDivElement>(null);

    return (
        <ResultatOgStatusKort
            periode={vilkår}
            redigeringKnapp={
                skalViseRedigeringsknapp && (
                    <>
                        <HStack gap="2" ref={buttonRowRef}>
                            <SmallButton
                                className={styles.redigeringsknapp}
                                variant="tertiary"
                                onClick={startRedigering}
                                icon={<PencilIcon />}
                            />
                            <SmallButton
                                className={styles.redigeringsknapp}
                                variant="tertiary"
                                onClick={startKopiering}
                                icon={<FilesIcon />}
                            />
                        </HStack>
                        <Popover
                            anchorEl={buttonRowRef.current}
                            open={!!feilmeldingRedigering}
                            onClose={nullstillFeilmeldingRedigering ?? (() => {})}
                            placement="top"
                        >
                            <Popover.Content style={{ width: 'max-content' }}>
                                <ErrorMessage size="small">{feilmeldingRedigering}</ErrorMessage>
                            </Popover.Content>
                        </Popover>
                    </>
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

                <VStack gap="1">
                    <>
                        <BodyShort size="small">
                            <strong>Adresse aktivitet:</strong> {adresse || '-'}
                        </BodyShort>
                        <Skillelinje />
                    </>
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
