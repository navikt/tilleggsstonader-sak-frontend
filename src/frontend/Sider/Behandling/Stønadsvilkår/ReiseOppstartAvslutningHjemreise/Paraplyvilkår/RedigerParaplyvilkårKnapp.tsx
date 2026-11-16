import React, { useRef, useState } from 'react';

import { PencilIcon } from '@navikt/aksel-icons';
import { ErrorMessage, Popover } from '@navikt/ds-react';

import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import styles from '../EndreVilkår/EndreVilkårReiseOppstartAvslutningHjemreise.module.css';

interface Props {
    startRedigering: () => boolean;
}

export const RedigerParaplyvilkårKnapp: React.FC<Props> = ({ startRedigering }) => {
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
        <>
            <div ref={redigerKnappRef}>
                <SmallButton
                    type="button"
                    variant="tertiary"
                    icon={<PencilIcon aria-hidden />}
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
    );
};
