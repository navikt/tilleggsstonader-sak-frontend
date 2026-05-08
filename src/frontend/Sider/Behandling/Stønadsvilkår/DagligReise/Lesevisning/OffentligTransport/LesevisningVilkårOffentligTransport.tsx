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

import { LesevisningFaktaOffentligTransport } from './LesevisningFaktaOffentligTransport';
import SmallButton from '../../../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../../../komponenter/Skillelinje';
import { formaterNullablePeriode } from '../../../../../../utils/dato';
import { VilkårsresultatTilTekst } from '../../../../Inngangsvilkår/Vilkårperioder/VilkårperiodeKort/tekstmapping';
import {
    regelIdTilSpørsmålKortversjon,
    svarIdTilTekstKorversjon,
} from '../../../../Vilkårvurdering/tekster';
import { FaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { typeDagligReiseTilTekst, VilkårDagligReise } from '../../typer/vilkårDagligReise';
import styles from '../Felles/LesevisningVilkårDagligReise.module.css';

export const LesevisningVilkårOffentligTransport: FC<{
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
    const endringsknapperRef = useRef<HTMLDivElement>(null);

    return (
        <ResultatOgStatusKort
            periode={vilkår}
            redigeringKnapp={
                skalViseRedigeringsknapp && (
                    <>
                        <HStack gap="space-8" ref={endringsknapperRef}>
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
                            anchorEl={endringsknapperRef.current}
                            open={!!feilmeldingRedigering}
                            onClose={nullstillFeilmeldingRedigering ?? (() => {})}
                            placement="top"
                        >
                            <Popover.Content className={styles.popoverContent}>
                                <ErrorMessage size="small">{feilmeldingRedigering}</ErrorMessage>
                            </Popover.Content>
                        </Popover>
                    </>
                )
            }
        >
            <HGrid gap={{ md: 'space-16', lg: 'space-32' }} columns="minmax(auto, 234px) auto">
                <VStack gap="space-24">
                    <VStack gap="space-12">
                        <Label size="small">{formaterNullablePeriode(fom, tom)}</Label>
                        <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
                        <LesevisningFaktaOffentligTransport
                            fakta={fakta as FaktaOffentligTransport}
                        />
                    </VStack>
                    <Tag
                        data-color="neutral"
                        size="small"
                        style={{ width: 'max-content' }}
                        variant="outline"
                        icon={<BusIcon />}
                    >
                        {typeDagligReiseTilTekst[fakta?.type]}
                    </Tag>
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
                            {delvilkår.vurderinger.map((vurdering, i) => (
                                <Fragment key={i}>
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
