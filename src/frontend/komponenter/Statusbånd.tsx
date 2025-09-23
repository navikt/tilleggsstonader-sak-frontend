import React from 'react';

import styled from 'styled-components';

import { BodyShort } from '@navikt/ds-react';
import {
    BgNeutralModerateHover,
    BgNeutralModeratePressed,
    BgSuccessModerateHover,
    BgSuccessModeratePressed,
    BgWarningModerateHover,
    BgWarningModeratePressed,
} from '@navikt/ds-tokens/darkside-js';

import { PeriodeStatus } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { formaterEnumVerdi } from '../utils/tekstformatering';

const Ribbon = styled.div<{ $hovedfarge: string; $skygge: string }>`
    position: absolute;
    overflow: hidden;
    width: 80px;
    height: 80px;
    z-index: 1;

    top: -5px;
    right: -5px;

    pointer-events: none;

    &::before,
    &::after {
        position: absolute;
        z-index: -1;
        content: '';
        display: block;
        border: 2.5px solid ${(props) => props.$skygge};
        border-top-color: transparent;
        border-right-color: transparent;
    }

    &::before {
        top: 0;
        left: 0;
    }

    &::after {
        bottom: 0;
        right: 0;
    }

    p {
        position: absolute;
        display: block;
        width: 113px;
        padding: 5px 0;
        background-color: ${(props) => props.$hovedfarge};
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        font-weight: 600;
        text-align: center;

        left: -6px;
        top: 15px;
        transform: rotate(45deg);
    }
`;

interface BannerFarge {
    hoved: string;
    skygge: string;
}

const utledFarge = (status: PeriodeStatus): BannerFarge | undefined => {
    switch (status) {
        case PeriodeStatus.NY:
            return { hoved: BgSuccessModerateHover, skygge: BgSuccessModeratePressed };
        case PeriodeStatus.ENDRET:
            return { hoved: BgWarningModerateHover, skygge: BgWarningModeratePressed };
        case PeriodeStatus.SLETTET:
            return { hoved: BgNeutralModerateHover, skygge: BgNeutralModeratePressed };
        default:
            return;
    }
};

export const Statusbånd: React.FC<{ status: PeriodeStatus }> = ({ status }) => {
    if (!status) return null;

    const farger = utledFarge(status);

    if (!farger) {
        return null;
    }

    return (
        <Ribbon $hovedfarge={farger.hoved} $skygge={farger.skygge}>
            <BodyShort size="small">{formaterEnumVerdi(status)}</BodyShort>
        </Ribbon>
    );
};
