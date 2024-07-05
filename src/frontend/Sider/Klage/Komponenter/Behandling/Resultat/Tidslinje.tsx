import * as React from 'react';
import { IBehandlingshistorikk } from '../Høyremeny/behandlingshistorikk';
import {
    Behandling,
    BehandlingResultat,
    behandlingStegTilTekst,
    StegType,
} from '../../../App/typer/fagsak';
import styled from 'styled-components';
import { Button, Detail, Heading, Label } from '@navikt/ds-react';
import { ClockIcon } from '@navikt/aksel-icons';
import { utledStegutfallForFerdigstiltBehandling } from '../utils';
import { fjernDuplikatStegFraHistorikk } from './utils';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import Advarsel from '../../../Felles/Ikoner/Advarsel';
import Info from '../../../Felles/Ikoner/Info';
import { formaterIsoDato, formaterIsoKlokke } from '../../../../../utils/dato';

const Flexbox = styled.div<{ åpenHøyremeny: boolean }>`
    display: flex;
    @media (max-width: ${(props) => (props.åpenHøyremeny ? '1449px' : '1149px')}) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    @media (min-width: ${(props) => (props.åpenHøyremeny ? '1450px' : '1150px')}) {
        flex-direction: row;
    }
`;

const HistorikkInnslag = styled.div<{ åpenHøyremeny: boolean }>`
    @media (max-width: ${(props) => (props.åpenHøyremeny ? '1449px' : '1149px')}) {
        width: 10rem;
    }
    @media (min-width: ${(props) => (props.åpenHøyremeny ? '1450px' : '1150px')}) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: auto 5rem auto;
        align-self: stretch;
    }
`;

const RevurderingAlertContainer = styled.div<{ åpenHøyremeny: boolean }>`
    @media (max-width: ${(props) => (props.åpenHøyremeny ? '1449px' : '1149px')}) {
        width: 14rem;
    }
    @media (min-width: ${(props) => (props.åpenHøyremeny ? '1450px' : '1150px')}) {
        flex-grow: 1;
        display: grid;
        grid-template-columns: auto 14rem auto;
    }
`;

const LinjeStiplet = styled.div<{ åpenHøyremeny: boolean }>`
    @media (max-width: ${(props) => (props.åpenHøyremeny ? '1449px' : '1149px')}) {
        border-left: 2px dashed black;
        margin: 0 auto 2px;
        width: 0px;
        height: 2rem;
    }
    @media (min-width: ${(props) => (props.åpenHøyremeny ? '1450px' : '1150px')}) {
        border-top: 2px dashed black;
        margin-top: 3.25rem;
        margin-left: 2px;
    }
`;

const LinjeSort = styled.div<{ synlig: boolean; åpenHøyremeny: boolean }>`
    @media (max-width: ${(props) => (props.åpenHøyremeny ? '1449px' : '1149px')}) {
        ${(props) => (props.synlig ? '' : 'transparent')}
        border-left: 2px solid black;
        margin: 0 auto;
        height: 2rem;
        width: 0px;
    }
    @media (min-width: ${(props) => (props.åpenHøyremeny ? '1450px' : '1150px')}) {
        border-top: 2px solid ${(props) => (props.synlig ? 'black' : 'transparent')};
        margin-top: 3.25rem;
    }
`;

const NodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    text-align: center;
    align-items: center;
`;

const Tittel = styled(Heading)<{ tittelErToLinjer: boolean; åpenHøyremeny: boolean }>`
    min-width: 9rem;
    margin-bottom: 0.75rem;

    @media (min-width: ${(props) => (props.åpenHøyremeny ? '1450px' : '1150px')}) {
        ${(props) =>
            props.tittelErToLinjer
                ? 'position: relative; bottom: 1rem; margin-bottom: -0.75rem'
                : ''}
    }
`;

const Suksess = styled(Oppfylt)`
    margin: auto;
    margin-bottom: 0.5rem;
`;

/**
 * Hvis resultat = HENLAGT, vis kun opprettet og ferdigstilt
 * Hvis Resultat = IKKE_MEDHOLD_FORMKRAV_AVVIST, ikke vis vurdering, for å unngå at man først oppfylt krav, lagt inn vurdering, ikke oppfylt krav, ferdigstilt
 */
const filtrerResutatSteg = (
    behandlingHistorikk: IBehandlingshistorikk[],
    behandling: Behandling
) => {
    let historikk = fjernDuplikatStegFraHistorikk(behandlingHistorikk);
    if (behandling.resultat === BehandlingResultat.HENLAGT) {
        historikk = historikk.filter(
            (steg) =>
                steg.steg === StegType.OPPRETTET || steg.steg === StegType.BEHANDLING_FERDIGSTILT
        );
    }
    if (behandling.resultat === BehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST) {
        historikk = historikk.filter((steg) => steg.steg !== StegType.VURDERING);
    }
    return historikk;
};

export const Tidslinje: React.FC<{
    behandling: Behandling;
    behandlingHistorikk: IBehandlingshistorikk[];
    åpenHøyremeny: boolean;
}> = ({ behandling, behandlingHistorikk, åpenHøyremeny }) => {
    const historikk = filtrerResutatSteg(behandlingHistorikk, behandling);

    const harFåttMedhold = behandling.resultat === BehandlingResultat.MEDHOLD;
    return (
        <Flexbox åpenHøyremeny={åpenHøyremeny}>
            {historikk.map((steg, index) => {
                return (
                    <HistorikkInnslag key={index} åpenHøyremeny={åpenHøyremeny}>
                        <LinjeSort synlig={index > 0} åpenHøyremeny={åpenHøyremeny} />
                        <Node behandling={behandling} steg={steg} åpenHøyremeny={åpenHøyremeny} />
                        {index + 1 < historikk.length && (
                            <LinjeSort synlig={true} åpenHøyremeny={åpenHøyremeny} />
                        )}
                        {harFåttMedhold && index + 1 === historikk.length && (
                            <LinjeStiplet åpenHøyremeny={åpenHøyremeny} />
                        )}
                    </HistorikkInnslag>
                );
            })}
            {harFåttMedhold && (
                <RevurderingAlertContainer åpenHøyremeny={åpenHøyremeny}>
                    <LinjeStiplet åpenHøyremeny={åpenHøyremeny} />
                    <NodeContainer>
                        <Tittel
                            level="1"
                            size="xsmall"
                            tittelErToLinjer={false}
                            åpenHøyremeny={åpenHøyremeny}
                        >
                            Revurdering
                        </Tittel>
                        <MedholdRevurdering behandling={behandling} />
                    </NodeContainer>
                </RevurderingAlertContainer>
            )}
        </Flexbox>
    );
};

const Node: React.FC<{
    behandling: Behandling;
    steg: IBehandlingshistorikk;
    åpenHøyremeny: boolean;
}> = ({ behandling, steg, åpenHøyremeny }) => {
    const tittelErToLinjer =
        steg.steg === StegType.OVERFØRING_TIL_KABAL || steg.steg === StegType.KABAL_VENTER_SVAR;

    return (
        <NodeContainer>
            <Tittel
                level="1"
                size="xsmall"
                tittelErToLinjer={tittelErToLinjer}
                åpenHøyremeny={åpenHøyremeny}
            >
                {behandlingStegTilTekst[steg.steg]}
            </Tittel>
            {steg.endretTid ? <Suksess width={36} height={36} /> : <ClockIcon fontSize="2.25rem" />}
            <Detail size="small">{steg.endretTid && formaterIsoDato(steg.endretTid)}</Detail>
            <Detail size="small">{steg.endretTid && formaterIsoKlokke(steg.endretTid)}</Detail>
            <Label size={'small'}>
                {utledStegutfallForFerdigstiltBehandling(behandling, steg.steg)}
            </Label>
        </NodeContainer>
    );
};

export const MedholdRevurdering: React.FC<{
    behandling: Behandling;
}> = ({ behandling }) => {
    const { fagsystemRevurdering } = behandling;
    if (fagsystemRevurdering?.opprettetBehandling) {
        const { eksternBehandlingId, opprettetTid } = fagsystemRevurdering.opprettet;
        return (
            <>
                <Info width={36} height={36} />
                <Detail size="small">{formaterIsoDato(opprettetTid)}</Detail>
                <Detail size="small">{formaterIsoKlokke(opprettetTid)}</Detail>
                <Label size={'small'}>Automatisk opprettet</Label>
                <Button
                    as={'a'}
                    variant={'secondary'}
                    size={'small'}
                    href={`/ekstern/behandling/${eksternBehandlingId}`}
                >
                    Åpne revurdering
                </Button>
            </>
        );
    } else {
        return (
            <>
                <Advarsel width={36} height={36} />
                <Label size={'small'}>Må manuelt opprettes</Label>
                {/*{fagsystemRevurdering && (*/}
                {/*    <Detail size="small">*/}
                {/*        Årsak:{' '}*/}
                {/*        {revurderingIkkeOpprettetÅrsak[fagsystemRevurdering.ikkeOpprettet.årsak]}*/}
                {/*    </Detail>*/}
                {/*)}*/}
                <Detail>
                    {' '}
                    {/*TODO bytt ut disse tre linjene med utkommentert kode når revurdering støttes*/}
                    Årsak: automatisk opprettelse støttes ikke per nå
                </Detail>
                <Button
                    as={'a'}
                    variant={'secondary'}
                    size={'small'}
                    href={`/ekstern/person/${behandling.eksternFagsystemFagsakId}`}
                >
                    Gå til saksoversikten
                </Button>
            </>
        );
    }
};
