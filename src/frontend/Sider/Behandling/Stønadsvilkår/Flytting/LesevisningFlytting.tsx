import React from 'react';

import { CarIcon, PencilIcon, TruckIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, HStack, Label, Tag, VStack } from '@navikt/ds-react';

import {
    FaktaFlyttingFlyttebyrå,
    FaktaFlyttingKjøreSelv,
    flyttingFaktaFeltTilTekst,
} from './typer/faktaFlytting';
import { VilkårFlytting } from './typer/vilkårFlytting';
import { tilDelvilkår, tilVilkårBase } from './utils';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../komponenter/Skillelinje';
import { VertikalSkillelinje } from '../../../../komponenter/VertikalSkillelinje';
import { formaterNullablePeriode } from '../../../../utils/dato';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../../utils/fomatering';
import { Vilkårsresultat } from '../../vilkår';
import { LesevisningDelvilkår } from '../Felles/Lesevisning/LesevisningDelvilkår';

interface Props {
    vilkår: VilkårFlytting;
    behandlingId: string;
    kanRedigere: boolean;
    startRedigering: () => void;
}

const FlyttingTag: React.FC<{ vilkår: VilkårFlytting }> = ({ vilkår }) => {
    if (vilkår.fakta.type === 'FLYTTING_KJØRE_SELV') {
        return (
            <Tag size="small" icon={<CarIcon />}>
                Flytte selv
            </Tag>
        );
    }

    if (vilkår.fakta.type === 'FLYTTING_FLYTTEBYRÅ') {
        return (
            <Tag size="small" icon={<TruckIcon />}>
                Flyttebyrå
            </Tag>
        );
    }

    if (vilkår.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL) {
        return (
            <Tag data-color="warning" size="small">
                Ikke ferdig utfylt
            </Tag>
        );
    }
};

export const FlyttingLesevisning: React.FC<Props> = ({
    vilkår,
    behandlingId,
    kanRedigere,
    startRedigering,
}) => (
    <ResultatOgStatusKort
        periode={tilVilkårBase(vilkår, behandlingId)}
        footer={
            <HStack justify={'space-between'} gap="space-8" padding="space-12">
                <FlyttingTag vilkår={vilkår} />
                {kanRedigere && (
                    <SmallButton
                        variant="tertiary"
                        onClick={startRedigering}
                        icon={<PencilIcon />}
                    />
                )}
            </HStack>
        }
    >
        <VStack gap="space-12">
            <HStack gap="space-32">
                <div>
                    <BodyShort size="small">Periode</BodyShort>
                    <Label size="small">{formaterNullablePeriode(vilkår.fom, vilkår.tom)}</Label>
                </div>
                {vilkår.fakta.adresse && (
                    <div>
                        <BodyShort size="small">Adresse brukeren skal flytte til</BodyShort>
                        <Label size="small">{vilkår.fakta.adresse || 'Adresse ikke fylt ut'}</Label>
                    </div>
                )}
            </HStack>
            <Skillelinje utenMargin />

            <HGrid gap={{ md: 'space-16', lg: 'space-32' }} columns="minmax(auto, 280px) 1px auto">
                <LesevisningFaktaFlytting vilkår={vilkår} />
                <VertikalSkillelinje />
                <LesevisningDelvilkår delvilkårsett={tilDelvilkår(vilkår)} />
            </HGrid>
        </VStack>
    </ResultatOgStatusKort>
);

const LesevisningFaktaFlytting: React.FC<{ vilkår: VilkårFlytting }> = ({ vilkår }) => {
    const fakta = vilkår.fakta;

    return (
        <VStack gap="space-12" paddingBlock="space-16 space-0">
            {fakta.type === 'FLYTTING_FLYTTEBYRÅ' && (
                <LesevisningFlyttingFlyttebyrå fakta={fakta} />
            )}
            {fakta.type === 'FLYTTING_KJØRE_SELV' && <LesevisningFlyttingPrivatBil fakta={fakta} />}
        </VStack>
    );
};

const LesevisningFlyttingFlyttebyrå: React.FC<{
    fakta: FaktaFlyttingFlyttebyrå;
}> = ({ fakta }) => {
    return (
        <HStack gap="space-12" justify={'space-between'}>
            {[fakta.tilbud1, fakta.tilbud2].map((tilbud, index) => (
                <VStack key={index} gap="space-4">
                    <BodyShort weight="semibold" size="small">
                        Flyttebyrå {index + 1}
                    </BodyShort>
                    <BodyShort size="small">{tilbud.navn ?? 'Navn ikke fylt ut'}</BodyShort>
                    <BodyShort size="small">
                        {tilbud.pris === null ? 'Pris ikke fylt ut' : `${tilbud.pris} kr`}
                    </BodyShort>
                </VStack>
            ))}
        </HStack>
    );
};

const LesevisningFlyttingPrivatBil: React.FC<{
    fakta: FaktaFlyttingKjøreSelv;
}> = ({ fakta }) => {
    return (
        <VStack gap="space-12">
            <HStack justify={'space-between'}>
                <BodyShort size="small" weight="semibold">
                    {'Reiseavstand i km én vei'}
                </BodyShort>
                <BodyShort size="small">
                    {fakta.avstandEnVei
                        ? `${formaterTallMedTusenSkilleEllerStrek(fakta.avstandEnVei)} km`
                        : '-'}
                </BodyShort>
            </HStack>

            {(['henger', 'bompenger', 'ferge', 'parkering'] as const).map((felt) => (
                <HStack justify={'space-between'} key={felt}>
                    <BodyShort size="small" weight="semibold">
                        {flyttingFaktaFeltTilTekst[felt]}
                    </BodyShort>
                    <BodyShort size="small">
                        {fakta[felt] !== null && fakta[felt] !== undefined
                            ? `${formaterTallMedTusenSkilleEllerStrek(fakta[felt])} kr`
                            : 'Ingen kostnad'}
                    </BodyShort>
                </HStack>
            ))}
        </VStack>
    );
};
