import React, { FC, useState } from 'react';

import styled from 'styled-components';

import { ChevronDownIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Link } from '@navikt/ds-react';
import { ATextDefault, ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

import { stønadstypeTilTekst } from '../../../../typer/behandling/behandlingTema';
import { formaterIsoDatoTid } from '../../../../utils/dato';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import { behandlingStatusTilTekst } from '../../typer/klagebehandling/klagebehandlingStatus';
import {
    behandlingResultatTilTekst,
    utledTekstForBehandlingsresultat,
} from '../../utils/behandlingsresultat';

interface StatusMenyInnholdProps {
    $åpen: boolean;
}

interface StatusProps {
    kunEttElement?: boolean;
}

// @ts-ignore
export const GråTekst = styled(BodyShort)`
    color: ${ATextSubtle};
`;

const StatusMenyInnhold = styled.div<{ $åpen: boolean }>`
    display: ${(props: StatusMenyInnholdProps) => (props.$åpen ? 'block' : 'none')};

    position: absolute;

    background-color: white;

    right: 1rem;

    border: 1px solid grey;

    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);

    ul,
    li {
        margin: 0;
    }

    ul {
        padding: 0.5rem;
    }

    li {
        padding: 0;
        list-style-type: none;
    }
`;

const VisStatuserKnapp = styled(Button)`
    color: ${ATextDefault};
`;

const VisStønadOgBehandlingstypePåLitenSkjerm = styled.div`
    @media screen and (min-width: 760px) {
        display: none;
    }
`;

export const Statuser = styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: center;

    white-space: nowrap;

    @media screen and (max-width: 1700px) {
        display: none;
    }
`;

export const StatuserLitenSkjerm = styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: center;

    white-space: nowrap;

    @media screen and (min-width: 1700px) {
        display: none;
    }
`;

export const Status = styled.div<StatusProps>`
    display: flex;
    width: 100%;
    margin-right: ${(props) => (props.kunEttElement ? '0' : '1.3rem')};

    flex-gap: 0.5rem;

    > p {
        font-size: 14px;
        margin: 0.2rem;
    }
`;

export const StatusMeny: FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    const [åpenStatusMeny, settÅpenStatusMeny] = useState<boolean>(false);

    return (
        <div>
            <VisStatuserKnapp
                variant="tertiary"
                onClick={() => {
                    settÅpenStatusMeny(!åpenStatusMeny);
                }}
            >
                <ChevronDownIcon fontSize="1.5rem" />
            </VisStatuserKnapp>
            <StatusMenyInnhold $åpen={åpenStatusMeny}>
                <ul>
                    <VisStønadOgBehandlingstypePåLitenSkjerm>
                        <li>
                            <Status>
                                <GråTekst>Stønadstype</GråTekst>
                                <BodyShort>{stønadstypeTilTekst[behandling.stønadstype]}</BodyShort>
                            </Status>
                        </li>
                    </VisStønadOgBehandlingstypePåLitenSkjerm>
                    <li>
                        <Status>
                            <GråTekst>Behandlingsstatus</GråTekst>
                            <BodyShort>{behandlingStatusTilTekst[behandling.status]}</BodyShort>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Behandlingsresultat</GråTekst>
                            <BodyShort>{behandlingResultatTilTekst[behandling.resultat]}</BodyShort>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Opprettet</GråTekst>
                            <BodyShort>{formaterIsoDatoTid(behandling.opprettet)}</BodyShort>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Sist endret</GråTekst>
                            <BodyShort>{formaterIsoDatoTid(behandling.sistEndret)}</BodyShort>
                        </Status>
                    </li>
                    {behandling.påklagetVedtak.eksternFagsystemBehandlingId && (
                        <li>
                            <Status>
                                <Link
                                    href={`/ekstern/behandling/${behandling.påklagetVedtak.eksternFagsystemBehandlingId}`}
                                    target="_blank"
                                >
                                    Gå til behandling
                                    <ExternalLinkIcon
                                        aria-label="Gå til behandling"
                                        fontSize="1.5rem"
                                    />
                                </Link>
                            </Status>
                        </li>
                    )}
                    <li>
                        <Status>
                            <Link
                                href={`/ekstern/person/${behandling.eksternFagsystemFagsakId}`}
                                target="_blank"
                            >
                                Gå til saksoversikt
                                <ExternalLinkIcon
                                    aria-label="Gå til saksoversikt"
                                    fontSize="1.5rem"
                                />
                            </Link>
                        </Status>
                    </li>
                </ul>
            </StatusMenyInnhold>
        </div>
    );
};

export const AlleStatuser: FC<{ behandling: Klagebehandling }> = ({ behandling }) => {
    return (
        <Statuser>
            <Status>
                <GråTekst>Behandlingsstatus</GråTekst>
                <BodyShort>{behandlingStatusTilTekst[behandling.status]}</BodyShort>
            </Status>
            <Status>
                <GråTekst>Behandlingsresultat</GråTekst>
                <BodyShort>{utledTekstForBehandlingsresultat(behandling)}</BodyShort>
            </Status>
            <Status>
                <GråTekst>Opprettet</GråTekst>
                <BodyShort>{formaterIsoDatoTid(behandling.opprettet)}</BodyShort>
            </Status>
            <Status>
                <GråTekst>Sist endret</GråTekst>
                <BodyShort>{formaterIsoDatoTid(behandling.sistEndret)}</BodyShort>
            </Status>
            {behandling.påklagetVedtak.eksternFagsystemBehandlingId && (
                <Status>
                    <Link
                        href={`/ekstern/behandling/${behandling.påklagetVedtak.eksternFagsystemBehandlingId}`}
                        target="_blank"
                    >
                        Gå til behandling
                        <ExternalLinkIcon aria-label="Gå til behandling" fontSize="1.5rem" />
                    </Link>
                </Status>
            )}
            <Status>
                <Link
                    href={`/ekstern/person/${behandling.eksternFagsystemFagsakId}`}
                    target="_blank"
                >
                    Gå til saksoversikt
                    <ExternalLinkIcon aria-label="Gå til saksoversikt" fontSize="1.5rem" />
                </Link>
            </Status>
        </Statuser>
    );
};
