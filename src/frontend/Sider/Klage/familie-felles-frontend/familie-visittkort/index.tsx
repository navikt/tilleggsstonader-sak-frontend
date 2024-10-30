import * as React from 'react';

import styled from 'styled-components';

import { CopyButton, HStack, Label } from '@navikt/ds-react';
import { ABorderStrong, ABorderSubtle, ASpacing4 } from '@navikt/ds-tokens/dist/tokens';

export interface IProps extends React.PropsWithChildren {
    alder: number;
    ident: string;
    navn: string | React.ReactNode;
    ikon?: React.ReactElement;
    dempetKantlinje?: boolean;
    borderBottom?: boolean;
}

const StyledVisittkort = styled(HStack)<{ $dempetKantlinje: boolean }>`
    ${(props) =>
        props.$borderBottom &&
        `border-bottom: 1px solid ${props.$dempetKantlinje ? ABorderSubtle : ABorderStrong}`};
    height: 3rem;
    padding: 0 ${ASpacing4};
`;

const GrådigChildrenContainer = styled(HStack)`
    flex: 1;
`;

export const Visittkort: React.FunctionComponent<IProps> = ({
    alder,
    children,
    ident,
    navn,
    dempetKantlinje = false,
    borderBottom = true,
}) => {
    return (
        <StyledVisittkort
            align="center"
            justify="space-between"
            gap="4"
            $dempetKantlinje={dempetKantlinje}
            $borderBottom={borderBottom}
        >
            <HStack align="center" gap="4">
                {typeof navn === 'string' ? (
                    <Label size={'small'}>
                        {navn} ({alder} år)
                    </Label>
                ) : (
                    navn
                )}
                <div>|</div>
                <HStack align="center" gap="1">
                    {ident}
                    <CopyButton copyText={ident.replace(' ', '')} size={'small'} />
                </HStack>
            </HStack>
            <GrådigChildrenContainer align="center" gap="4">
                {children}
            </GrådigChildrenContainer>
        </StyledVisittkort>
    );
};

export default Visittkort;
