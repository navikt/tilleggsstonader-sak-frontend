import React from 'react';

import styled from 'styled-components';

import { Detail, Label } from '@navikt/ds-react';
import { AGray100, AGray400 } from '@navikt/ds-tokens/dist/tokens';

import HendelseIkon from './HendelseIkon';
import Metadata from './Metadata';
import { hendelseTilHistorikkTekst, HistorikkHendelse } from './typer';
import { formaterIsoDatoTidKort } from '../../../../utils/dato';

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

const HistorikkElement: React.FC<{
    erSisteElementIListe: boolean;
    historikkHendelse: HistorikkHendelse;
}> = ({ historikkHendelse, erSisteElementIListe }) => {
    return (
        <Container>
            <div>
                <BlåRunding>
                    <HendelseIkon hendelse={historikkHendelse.hendelse} />
                </BlåRunding>
                {!erSisteElementIListe && <Linje />}
            </div>
            <InnholdContainer>
                <Label size="small">{hendelseTilHistorikkTekst[historikkHendelse.hendelse]}</Label>
                <Detail>
                    {formaterIsoDatoTidKort(historikkHendelse.endretTid)} |{' '}
                    {historikkHendelse.endretAvNavn}
                </Detail>
                {historikkHendelse.metadata && <Metadata metadata={historikkHendelse.metadata} />}
            </InnholdContainer>
        </Container>
    );
};

export default HistorikkElement;
