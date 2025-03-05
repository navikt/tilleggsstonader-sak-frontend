import React from 'react';

import { HStack, Tag } from '@navikt/ds-react';

import { AktivitetUlikRegisterVarsel } from './AktivitetUlikRegisterVarsel';
import { Registeraktivitet } from '../../../../../typer/registeraktivitet';
import { Aktivitet } from '../../typer/vilkårperiode/aktivitet';

export const AktivitetkortFooter: React.FC<{
    aktivitet: Aktivitet;
    aktivitetFraRegister: Registeraktivitet | undefined;
}> = ({ aktivitet, aktivitetFraRegister }) => {
    return (
        <HStack justify="space-between" width="100%">
            <AktivitetUlikRegisterVarsel
                aktivitet={aktivitet}
                aktivitetFraRegister={aktivitetFraRegister}
            />
            {aktivitet.kildeId && (
                <Tag variant="alt2" size="small" style={{ marginLeft: 'auto' }}>
                    {aktivitet.kildeId}
                </Tag>
            )}
        </HStack>
    );
};
