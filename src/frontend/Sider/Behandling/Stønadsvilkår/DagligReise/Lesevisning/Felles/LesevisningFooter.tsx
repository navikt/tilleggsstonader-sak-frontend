import React, { FC, ReactNode, useRef } from 'react';

import { FilesIcon, PencilIcon } from '@navikt/aksel-icons';
import { ErrorMessage, HStack, Popover } from '@navikt/ds-react';

import styles from './LesevisningVilkårDagligReise.module.css';
import SmallButton from '../../../../../../komponenter/Knapper/SmallButton';

export interface RedigerVilkårProps {
    startRedigering?: () => void;
    startKopiering?: () => void;
    feilmeldingRedigering?: string;
    nullstillFeilmeldingRedigering?: () => void;
    skalViseRedigeringsknapp: boolean;
}

interface Props extends RedigerVilkårProps {
    typeTag: ReactNode;
}

export const LesevisningFooter: FC<Props> = ({
    startRedigering,
    skalViseRedigeringsknapp,
    startKopiering,
    feilmeldingRedigering,
    nullstillFeilmeldingRedigering,
    typeTag,
}) => {
    const endringsknapperRef = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.footer}>
            {typeTag}
            {skalViseRedigeringsknapp && (
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
            )}
        </div>
    );
};
