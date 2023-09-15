import * as React from 'react';
import { FC, ReactNode } from 'react';

import styled from 'styled-components';

import { DatabaseIcon, FileTextIcon } from '@navikt/aksel-icons';
import { Heading, Label } from '@navikt/ds-react';

import { FlexColumnContainer, UnderoverskriftWrapper } from './StyledVilkårInnhold';

interface UnderseksjonWrapperProps {
    underoverskrift: string;
    children: ReactNode;
}

export const UnderseksjonWrapper: FC<UnderseksjonWrapperProps> = ({
    underoverskrift,
    children,
}) => {
    return (
        <FlexColumnContainer>
            <Label className="tittel" as="h3" size="small">
                {underoverskrift}
            </Label>
            {children}
        </FlexColumnContainer>
    );
};

interface InfoSeksjonWrapperProps {
    ikon: ReactNode;
    undertittel?: ReactNode;
    children: ReactNode;
}

const HeadingMedUnderlinje = styled(Heading)`
    text-decoration: underline;
`;

export const InfoSeksjonWrapper: FC<InfoSeksjonWrapperProps> = ({
    ikon,
    undertittel,
    children,
}) => {
    return (
        <FlexColumnContainer gap={1}>
            <UnderoverskriftWrapper>
                {ikon}
                <HeadingMedUnderlinje size="xsmall">{undertittel}</HeadingMedUnderlinje>
            </UnderoverskriftWrapper>
            {children}
        </FlexColumnContainer>
    );
};

export enum VilkårInfoIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
}

export const mapIkon = (ikon: VilkårInfoIkon) => {
    switch (ikon) {
        case VilkårInfoIkon.REGISTER:
            return <DatabaseIcon />;
        case VilkårInfoIkon.SØKNAD:
            return <FileTextIcon />;
    }
};
