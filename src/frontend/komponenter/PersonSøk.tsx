import React, { FormEvent, useCallback, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { Alert, Popover, Search } from '@navikt/ds-react';
import { ATextDefault } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../context/AppContext';
import { RessursStatus } from '../typer/ressurs';

export type Søkeresultat = {
    personIdent: string;
    visningsnavn: string;
    kjønn: Kjønn;
    fagsakPersonId?: string;
};

enum Kjønn {
    KVINNE = 'KVINNE',
    MANN = 'MANN',
    UKJENT = 'UKJENT',
}

const Container = styled.div`
    padding: 0.5rem;
`;

const StyledAlert = styled(Alert)`
    width: 24rem;
    color: ${ATextDefault};
`;

const erPositivtTall = (verdi: string) => /^\d+$/.test(verdi) && Number(verdi) !== 0;

const PersonSøk: React.FC = () => {
    const { request } = useApp();
    const navigate = useNavigate();
    const søkRef = useRef<HTMLDivElement>(null);
    const [søkestreng, settSøkestreng] = useState<string>();
    const [feilmelding, settFeilmelding] = useState<string>();

    const søkPerson = useCallback(
        (personIdent: string) => {
            request<Søkeresultat, { personIdent: string }>(`/api/sak/sok/person`, 'POST', {
                personIdent: personIdent,
            }).then((resultat) => {
                if (resultat.status === RessursStatus.SUKSESS) {
                    navigate(`/person/${resultat.data.fagsakPersonId}`);
                } else {
                    settFeilmelding(resultat.frontendFeilmelding);
                }
            });
        },
        [navigate, request]
    );

    const søkPersonEksternFagsakId = useCallback(
        (eksternFagsakId: string) => {
            request<Søkeresultat, null>(
                `/api/sak/sok/person/fagsak-ekstern/${eksternFagsakId}`
            ).then((resultat) => {
                if (resultat.status === RessursStatus.SUKSESS) {
                    navigate(`/person/${resultat.data.fagsakPersonId}`);
                } else {
                    settFeilmelding(resultat.frontendFeilmelding);
                }
            });
        },
        [navigate, request]
    );

    const søk = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!søkestreng) return;

        if (erPositivtTall(søkestreng) && søkestreng.length !== 11) {
            søkPersonEksternFagsakId(søkestreng);
        } else {
            søkPerson(søkestreng);
        }
    };

    return (
        <Container>
            <form role="search" onSubmit={søk}>
                <Search
                    variant="simple"
                    label="Søk etter fagsak for en person"
                    name="søk"
                    onChange={settSøkestreng}
                    value={søkestreng}
                    ref={søkRef}
                    size="small"
                />
            </form>
            <Popover
                anchorEl={søkRef.current}
                open={feilmelding !== undefined}
                onClose={() => {
                    settFeilmelding(undefined);
                }}
                arrow={false}
                placement="bottom"
            >
                <Popover.Content
                    style={{
                        padding: '0px',
                    }}
                >
                    <StyledAlert variant="error">{feilmelding}</StyledAlert>
                </Popover.Content>
            </Popover>
        </Container>
    );
};

export default PersonSøk;
