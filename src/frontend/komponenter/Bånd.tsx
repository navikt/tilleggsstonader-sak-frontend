import React from 'react';

import styled from 'styled-components';

import { BodyShort } from '@navikt/ds-react';
import {
    AGray200,
    AGray300,
    AGreen300,
    AGreen400,
    AOrange400,
    AOrange500,
} from '@navikt/ds-tokens/dist/tokens';

import { PeriodeStatus } from '../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode';
import { formaterEnumVerdi } from '../utils/tekstformatering';

const Ribbon = styled.div<{ hovedfarge: string; skygge: string }>`
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: absolute;
    z-index: 100;

    top: -5px;
    right: -5px;

    &::before,
    &::after {
        position: absolute;
        z-index: -1;
        content: '';
        display: block;
        border: 2.5px solid ${(props) => props.skygge};
        border-top-color: transparent;
        border-right-color: transparent;
    }

    &::before {
        top: 0;
        left: 9px;
    }

    &::after {
        bottom: 9px;
        right: 0;
    }

    p {
        position: absolute;
        display: block;
        width: 130px;
        padding: 5px 0;
        background-color: ${(props) => props.hovedfarge};
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        font-weight: 600;
        text-align: center;

        left: 0px;
        top: 20px;
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
            return { hoved: AGreen300, skygge: AGreen400 };
        case PeriodeStatus.ENDRET:
            return { hoved: AOrange400, skygge: AOrange500 };
        case PeriodeStatus.SLETTET:
            return { hoved: AGray200, skygge: AGray300 };
        default:
            return;
    }
};

export const Bånd: React.FC<{ status?: PeriodeStatus }> = ({ status }) => {
    if (!status) return null;

    const farger = utledFarge(status);

    if (!farger) {
        return null;
    }

    return (
        <Ribbon hovedfarge={farger.hoved} skygge={farger.skygge}>
            <BodyShort size="small">{formaterEnumVerdi(status)}</BodyShort>
        </Ribbon>
    );
};
