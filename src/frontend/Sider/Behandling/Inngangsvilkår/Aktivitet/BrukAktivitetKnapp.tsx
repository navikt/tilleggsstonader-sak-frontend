import React from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, Tag } from '@navikt/ds-react';

import { useSteg } from '../../../../context/StegContext';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';

export function BrukAktivitetKnapp({
    registerAktivitet,
    leggTilAktivitetFraRegister,
    harBruktAktivitet,
}: {
    registerAktivitet: Registeraktivitet;
    leggTilAktivitetFraRegister: (registerAktivitet: Registeraktivitet) => void;
    harBruktAktivitet: boolean;
}) {
    const { erStegRedigerbart } = useSteg();
    if (harBruktAktivitet) {
        return (
            <Tag
                size="small"
                variant="neutral"
                icon={<CheckmarkIcon />}
                style={{ maxWidth: 'fit-content', background: 'transparent', border: 'none' }}
            >
                Brukt
            </Tag>
        );
    } else if (erStegRedigerbart) {
        return (
            <Button size="xsmall" onClick={() => leggTilAktivitetFraRegister(registerAktivitet)}>
                Bruk
            </Button>
        );
    } else {
        return null;
    }
}
