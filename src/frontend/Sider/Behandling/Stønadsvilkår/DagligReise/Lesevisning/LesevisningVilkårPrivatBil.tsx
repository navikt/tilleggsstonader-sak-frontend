import React, { FC, Fragment, useRef } from 'react';

import { CarIcon, FilesIcon, PencilIcon } from '@navikt/aksel-icons';
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
import { FaktaPrivatBil } from '../typer/faktaDagligReise';
import { typeDagligReiseTilTekst, VilkårDagligReise } from '../typer/vilkårDagligReise';

export const LesevisningVilkårPrivatBil: FC<{
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

    const faktaPrivatBil = fakta as FaktaPrivatBil;

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
            <Label size="medium">{formaterNullablePeriode(fom, tom)}</Label>
            <BodyShort size="small">{VilkårsresultatTilTekst[resultat]}</BodyShort>
            <HStack gap="space-16">
                <VStack>
                    <span className="aksel-body-short aksel-body-short--small">
                        Reiseavstand en vei:
                    </span>
                    <BodyShort size="small">
                        <strong>{faktaPrivatBil.reiseavstandEnVei} km</strong>
                    </BodyShort>
                </VStack>

                <VStack>
                    <span className="aksel-body-short aksel-body-short--small">
                        Adresse aktivitet:
                    </span>
                    <BodyShort size="small">
                        <strong>{adresse}</strong>
                    </BodyShort>
                </VStack>
            </HStack>
            <Skillelinje />
            <HGrid gap={{ md: 'space-16', lg: 'space-32' }} columns="minmax(auto, 725px) auto">
                <VStack gap="space-24">
                    <VStack gap="space-12">
                        <LesevisningFaktaDagligReise fakta={faktaPrivatBil} />
                    </VStack>
                    <Tag
                        data-color="neutral"
                        size="small"
                        style={{ width: 'max-content' }}
                        variant="outline"
                        icon={<CarIcon />}
                    >
                        {typeDagligReiseTilTekst['PRIVAT_BIL']}
                    </Tag>
                </VStack>

                <VStack gap="space-4">
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
