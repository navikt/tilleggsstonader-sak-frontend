import * as React from 'react';

import { ClockIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, Label } from '@navikt/ds-react';

import styles from './Tidslinje.module.css';
import { fjernDuplikatStegFraHistorikk } from './utils';
import Info from '../../../../komponenter/Ikoner/Vurderingsresultat/Info';
import Oppfylt from '../../../../komponenter/Ikoner/Vurderingsresultat/Oppfylt';
import { formaterIsoDato, formaterIsoKlokke } from '../../../../utils/dato';
import Advarsel from '../../Komponenter/Ikoner/Advarsel';
import { Behandlingshistorikk } from '../../typer/behandlingshistorikk';
import { Klagebehandling } from '../../typer/klagebehandling/klagebehandling';
import { KlagebehandlingResultat } from '../../typer/klagebehandling/klagebehandlingResultat';
import {
    behandlingStegTilTekst,
    KlagebehandlingSteg,
} from '../../typer/klagebehandling/klagebehandlingSteg';
import { utledStegutfall } from '../../utils/behandlingsresultat';

/**
 * Hvis resultat = HENLAGT, vis kun opprettet og ferdigstilt
 * Hvis Resultat = IKKE_MEDHOLD_FORMKRAV_AVVIST, ikke vis vurdering, for å unngå at man først oppfylt krav, lagt inn vurdering, ikke oppfylt krav, ferdigstilt
 */
const filtrerResutatSteg = (
    behandlingHistorikk: Behandlingshistorikk[],
    behandling: Klagebehandling
) => {
    let historikk = fjernDuplikatStegFraHistorikk(behandlingHistorikk);
    if (behandling.resultat === KlagebehandlingResultat.HENLAGT) {
        historikk = historikk.filter(
            (steg) =>
                steg.steg === KlagebehandlingSteg.OPPRETTET ||
                steg.steg === KlagebehandlingSteg.BEHANDLING_FERDIGSTILT
        );
    }
    if (behandling.resultat === KlagebehandlingResultat.IKKE_MEDHOLD_FORMKRAV_AVVIST) {
        historikk = historikk.filter((steg) => steg.steg !== KlagebehandlingSteg.VURDERING);
    }
    return historikk;
};

export const Tidslinje: React.FC<{
    behandling: Klagebehandling;
    behandlingHistorikk: Behandlingshistorikk[];
    åpenHøyremeny: boolean;
}> = ({ behandling, behandlingHistorikk, åpenHøyremeny }) => {
    const historikk = filtrerResutatSteg(behandlingHistorikk, behandling);

    const harFåttMedhold = behandling.resultat === KlagebehandlingResultat.MEDHOLD;
    return (
        <div className={åpenHøyremeny ? styles.flexboxOpen : styles.flexbox}>
            {historikk.map((steg, index) => {
                return (
                    <div
                        key={index}
                        className={
                            åpenHøyremeny ? styles.historikkInnslagOpen : styles.historikkInnslag
                        }
                    >
                        <div
                            className={`${åpenHøyremeny ? styles.linjeSortOpen : styles.linjeSort} ${index > 0 ? '' : styles.linjeSortHidden}`}
                        />
                        <Node behandling={behandling} steg={steg} åpenHøyremeny={åpenHøyremeny} />
                        {index + 1 < historikk.length && (
                            <div
                                className={åpenHøyremeny ? styles.linjeSortOpen : styles.linjeSort}
                            />
                        )}
                        {harFåttMedhold && index + 1 === historikk.length && (
                            <div
                                className={
                                    åpenHøyremeny ? styles.linjeStipletOpen : styles.linjeStiplet
                                }
                            />
                        )}
                    </div>
                );
            })}
            {harFåttMedhold && (
                <div
                    className={
                        åpenHøyremeny
                            ? styles.revurderingAlertContainerOpen
                            : styles.revurderingAlertContainer
                    }
                >
                    <div
                        className={åpenHøyremeny ? styles.linjeStipletOpen : styles.linjeStiplet}
                    />
                    <div className={styles.nodeContainer}>
                        <Heading level="1" size="xsmall" className={styles.tittel}>
                            Revurdering
                        </Heading>
                        <MedholdRevurdering behandling={behandling} />
                    </div>
                </div>
            )}
        </div>
    );
};

const Node: React.FC<{
    behandling: Klagebehandling;
    steg: Behandlingshistorikk;
    åpenHøyremeny: boolean;
}> = ({ behandling, steg, åpenHøyremeny }) => {
    const tittelErToLinjer =
        steg.steg === KlagebehandlingSteg.OVERFØRING_TIL_KABAL ||
        steg.steg === KlagebehandlingSteg.KABAL_VENTER_SVAR;

    const tittelKlasse = tittelErToLinjer
        ? åpenHøyremeny
            ? styles.tittelToLinjerOpen
            : styles.tittelToLinjer
        : '';

    return (
        <div className={styles.nodeContainer}>
            <Heading level="1" size="xsmall" className={`${styles.tittel} ${tittelKlasse}`}>
                {behandlingStegTilTekst[steg.steg]}
            </Heading>
            {steg.endretTid ? (
                <Oppfylt width={36} height={36} className={styles.suksess} />
            ) : (
                <ClockIcon fontSize="2.25rem" />
            )}
            <Detail>{steg.endretTid && formaterIsoDato(steg.endretTid)}</Detail>
            <Detail>{steg.endretTid && formaterIsoKlokke(steg.endretTid)}</Detail>
            <Label size={'small'}>{utledStegutfall(behandling, steg.steg)}</Label>
        </div>
    );
};

export const MedholdRevurdering: React.FC<{
    behandling: Klagebehandling;
}> = ({ behandling }) => {
    const { fagsystemRevurdering } = behandling;
    if (fagsystemRevurdering?.opprettetBehandling) {
        const { eksternBehandlingId, opprettetTid } = fagsystemRevurdering.opprettet;
        return (
            <>
                <Info width={36} height={36} />
                <Detail>{formaterIsoDato(opprettetTid)}</Detail>
                <Detail>{formaterIsoKlokke(opprettetTid)}</Detail>
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
                {/*    <Detail>*/}
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
