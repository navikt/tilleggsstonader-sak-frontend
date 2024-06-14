import React from 'react';

import styled from 'styled-components';

import { Detail, Label } from '@navikt/ds-react';
import { AGray100, AGray400, AGray900 } from '@navikt/ds-tokens/dist/tokens';

import HendelseIkon from './HendelseIkon';
import Metadata from './Metadata';
import { Hendelseshistorikk, hendelseTilHistorikkTekst } from './typer';
import { formaterIsoDatoTidKort } from '../../../../utils/dato';

export interface HistorikkElementProps {
    erSisteElementIListe: boolean;
    behandlingshistorikk: Hendelseshistorikk;
}

const Linje = styled.div`
    margin-right: 12px;
    border-right: 1px dashed ${AGray400};
    min-height: 60px;
    height: 100%;
`;

const Container = styled.li`
    display: flex;
    gap: 0.5rem;
    list-style: none;

    .navds-body-short,
    .navds-label,
    .navds-detail {
        color: ${AGray900};
    }
`;

const BlåRunding = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${AGray100};

    display: flex;
    justify-content: center;
    align-items: center;
`;

const InnholdContainer = styled.div`
    margin-bottom: 1rem;
`;

const HistorikkElement: React.FC<HistorikkElementProps> = ({
    behandlingshistorikk,
    erSisteElementIListe,
}) => {
    return (
        <Container>
            <div>
                <BlåRunding>
                    <HendelseIkon hendelse={behandlingshistorikk.hendelse} />
                </BlåRunding>
                {!erSisteElementIListe && <Linje />}
            </div>
            <InnholdContainer>
                <Label size="small">
                    {hendelseTilHistorikkTekst[behandlingshistorikk.hendelse]}
                </Label>
                <Detail>
                    {formaterIsoDatoTidKort(behandlingshistorikk.endretTid)} |{' '}
                    {behandlingshistorikk.endretAvNavn}
                </Detail>
                {behandlingshistorikk.metadata && (
                    <Metadata metadata={behandlingshistorikk.metadata} />
                )}
            </InnholdContainer>
        </Container>
    );
};

export default HistorikkElement;
