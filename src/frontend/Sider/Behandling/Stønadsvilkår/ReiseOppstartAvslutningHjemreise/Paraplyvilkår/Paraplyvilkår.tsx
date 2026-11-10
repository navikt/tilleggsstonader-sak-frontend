import React, { ReactNode } from 'react';

import { PencilIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';

import { ReiserIParaplyvilkår } from './ReiserIParaplyvilkår';
import { useSteg } from '../../../../../context/StegContext';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { ParaplyvilkårReiseOppstartAvslutningHjemreise } from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    aktivitet: Aktivitet;
    tittel: string;
    vilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise | undefined;
    redigerer: boolean;
    startRedigering: () => void;
    skjema: ReactNode;
    lesevisning: ReactNode;
    slettknapp: ReactNode;
}

/**
 * Et paraplyvilkår har egne fakta og vurderinger, og samler reiser som hører til det.
 * Reiser kan først legges til når paraplyvilkåret er lagret.
 */
export const Paraplyvilkår: React.FC<Props> = ({
    aktivitet,
    tittel,
    vilkår,
    redigerer,
    startRedigering,
    skjema,
    lesevisning,
    slettknapp,
}) => {
    const { erStegRedigerbart } = useSteg();

    return (
        <ResultatOgStatusKort
            periode={vilkår}
            redigeres={redigerer}
            redigeringKnapp={
                erStegRedigerbart &&
                !redigerer && (
                    <SmallButton
                        type="button"
                        variant="tertiary"
                        icon={<PencilIcon aria-hidden />}
                        aria-label={`Rediger ${tittel.toLowerCase()}`}
                        onClick={startRedigering}
                    />
                )
            }
        >
            <section aria-label={tittel}>
                <VStack gap="space-16">
                    <Heading size="xsmall" level="4">
                        {tittel}
                    </Heading>
                    {erStegRedigerbart && redigerer ? skjema : lesevisning}
                    {vilkår ? (
                        <ReiserIParaplyvilkår aktivitet={aktivitet} paraplyvilkår={vilkår} />
                    ) : (
                        <HStack gap="space-16" align="center">
                            <SmallButton
                                type="button"
                                variant="secondary"
                                icon={<PlusCircleIcon />}
                                disabled
                            >
                                Legg til ny reise
                            </SmallButton>
                            <BodyShort size="small">
                                Lagre perioden før du legger til reiser
                            </BodyShort>
                        </HStack>
                    )}
                    {erStegRedigerbart && redigerer && <HStack justify="end">{slettknapp}</HStack>}
                </VStack>
            </section>
        </ResultatOgStatusKort>
    );
};
