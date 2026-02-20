import * as React from 'react';

import { CopyButton, HStack, Label } from '@navikt/ds-react';

import styles from './Visittkort.module.css';

export interface IProps extends React.PropsWithChildren {
    alder: number;
    ident: string;
    navn: string | React.ReactNode;
    ikon?: React.ReactElement;
    dempetKantlinje?: boolean;
    borderBottom?: boolean;
}

export const Visittkort: React.FunctionComponent<IProps> = ({
    alder,
    children,
    ident,
    navn,
    dempetKantlinje = false,
    borderBottom = true,
}) => {
    const borderClass = borderBottom
        ? dempetKantlinje
            ? styles.borderSubtle
            : styles.borderStrong
        : '';

    return (
        <HStack
            align="center"
            justify="start"
            gap="space-16"
            className={`visittkort ${styles.container} ${borderClass}`}
        >
            <HStack align="center" gap="space-16">
                {typeof navn === 'string' ? (
                    <Label size={'small'}>
                        {navn} ({alder} år)
                    </Label>
                ) : (
                    navn
                )}
                <div>|</div>
                <HStack align="center" gap="space-4">
                    {ident}
                    <CopyButton copyText={ident.replace(' ', '')} size={'small'} />
                </HStack>
            </HStack>
            <HStack align="center" gap="space-16">
                {children}
            </HStack>
        </HStack>
    );
};

export default Visittkort;
