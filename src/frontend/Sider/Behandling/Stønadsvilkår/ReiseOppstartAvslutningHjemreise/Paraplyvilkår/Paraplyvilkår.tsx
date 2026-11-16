import React, { ReactNode, useRef, useState } from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { ErrorMessage, Heading, Popover, VStack } from '@navikt/ds-react';

import { ReiserIParaplyvilkår } from './ReiserIParaplyvilkår';
import { useSteg } from '../../../../../context/StegContext';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import { ResultatOgStatusKort } from '../../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Aktivitet } from '../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import styles from '../EndreVilkår/EndreVilkårReiseOppstartAvslutningHjemreise.module.css';
import {
    ParaplyvilkårReiseOppstartAvslutningHjemreise,
    RedigeringslåsROAH,
} from '../typer/vilkårReiseOppstartAvslutningHjemreise';

interface Props {
    aktivitet: Aktivitet;
    tittel: string;
    vilkår: ParaplyvilkårReiseOppstartAvslutningHjemreise | undefined;
    redigerer: boolean;
    startRedigering: () => boolean;
    redigeringslås: RedigeringslåsROAH;
    skjema: ReactNode;
    lesevisning: ReactNode;
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
    redigeringslås,
    skjema,
    lesevisning,
}) => {
    const { erStegRedigerbart } = useSteg();
    const redigerKnappRef = useRef<HTMLDivElement>(null);
    const [feilmeldingRedigering, settFeilmeldingRedigering] = useState<string | undefined>(
        undefined
    );

    const handleStartRedigering = () => {
        if (!startRedigering()) {
            settFeilmeldingRedigering(
                'Ferdigstill redigering av annet vilkår før du starter ny redigering'
            );
        }
    };

    return (
        <ResultatOgStatusKort
            periode={vilkår}
            redigeres={redigerer}
            redigeringKnapp={
                erStegRedigerbart &&
                !redigerer && (
                    <>
                        <div ref={redigerKnappRef}>
                            <SmallButton
                                type="button"
                                variant="tertiary"
                                icon={<PencilIcon aria-hidden />}
                                aria-label={`Rediger ${tittel.toLowerCase()}`}
                                onClick={handleStartRedigering}
                            />
                        </div>
                        <Popover
                            anchorEl={redigerKnappRef.current}
                            open={!!feilmeldingRedigering}
                            onClose={() => settFeilmeldingRedigering(undefined)}
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
            <section aria-label={tittel}>
                <VStack gap="space-16">
                    <Heading size="xsmall" level="4">
                        {tittel}
                    </Heading>
                    {erStegRedigerbart && redigerer ? skjema : lesevisning}
                    {vilkår && (
                        <ReiserIParaplyvilkår
                            aktivitet={aktivitet}
                            paraplyvilkår={vilkår}
                            kanLeggeTilReise={!redigerer}
                            redigeringslås={redigeringslås}
                        />
                    )}
                </VStack>
            </section>
        </ResultatOgStatusKort>
    );
};
