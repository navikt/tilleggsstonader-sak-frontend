import React from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';

import { AktivitetFelt, harAktivitetsopplysninger } from './Aktivitet';
import { InfoSeksjon, OppsummeringFelt } from './Visningskomponenter';
import {
    dagligReiseTypeUtdanningTilTekst,
    FaktaAktivitetDagligReise,
} from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';
import { jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';

function harAktivitetDagligReiseOpplysninger(aktiviteter: FaktaAktivitetDagligReise): boolean {
    const dekkesUtgiftenAvAndre = aktiviteter.aktivitet.søknadsgrunnlag?.dekkesUtgiftenAvAndre;

    return Boolean(
        harAktivitetsopplysninger(aktiviteter.aktivitet) ||
        aktiviteter.reiseperiode ||
        dekkesUtgiftenAvAndre?.typeUtdanning ||
        dekkesUtgiftenAvAndre?.lærling ||
        dekkesUtgiftenAvAndre?.arbeidsgiverDekkerUtgift ||
        dekkesUtgiftenAvAndre?.erUnder25år ||
        dekkesUtgiftenAvAndre?.betalerForReisenTilSkolenSelv ||
        dekkesUtgiftenAvAndre?.lønnetAktivitet
    );
}

export const AktivitetDagligReise: React.FC<{
    aktiviteter: FaktaAktivitetDagligReise;
}> = ({ aktiviteter }) => {
    const reiseperiode = aktiviteter.reiseperiode;
    const dekkesUtgiftenAvAndre = aktiviteter.aktivitet.søknadsgrunnlag?.dekkesUtgiftenAvAndre;

    if (!harAktivitetDagligReiseOpplysninger(aktiviteter)) {
        return null;
    }

    return (
        <InfoSeksjon label="Arbeidsrettet aktivitet" ikon={<BriefcaseIcon />}>
            <AktivitetFelt aktivitet={aktiviteter.aktivitet} />
            {reiseperiode && (
                <OppsummeringFelt
                    label="Periode du må reise til aktivitetsstedet"
                    value={formaterIsoPeriodeMedTankestrek(reiseperiode)}
                />
            )}
            {dekkesUtgiftenAvAndre?.typeUtdanning && (
                <OppsummeringFelt
                    label="Hva slags type arbeidsrettet aktivitet går du på?"
                    value={dagligReiseTypeUtdanningTilTekst[dekkesUtgiftenAvAndre.typeUtdanning]}
                />
            )}
            {dekkesUtgiftenAvAndre?.lærling && (
                <OppsummeringFelt
                    label="Er du lærling, lærekandidat, praksisbrevkandidat eller kandidat for fagbrev på jobb?"
                    value={jaNeiTilTekst[dekkesUtgiftenAvAndre.lærling]}
                />
            )}
            {dekkesUtgiftenAvAndre?.arbeidsgiverDekkerUtgift && (
                <OppsummeringFelt
                    label="Får du dekket reisen til aktivitetsstedet av arbeidsgiveren din?"
                    value={jaNeiTilTekst[dekkesUtgiftenAvAndre.arbeidsgiverDekkerUtgift]}
                />
            )}
            {dekkesUtgiftenAvAndre?.erUnder25år && (
                <OppsummeringFelt
                    label="Er eller var du under 25 år ved starten av skoleåret?"
                    value={jaNeiTilTekst[dekkesUtgiftenAvAndre.erUnder25år]}
                />
            )}
            {dekkesUtgiftenAvAndre?.betalerForReisenTilSkolenSelv && (
                <OppsummeringFelt
                    label="Må du betale for reisen til skolen selv?"
                    value={jaNeiTilTekst[dekkesUtgiftenAvAndre.betalerForReisenTilSkolenSelv]}
                />
            )}
            {dekkesUtgiftenAvAndre?.lønnetAktivitet && (
                <OppsummeringFelt
                    label="Mottar du ordinær lønn gjennom tiltaket?"
                    value={jaNeiTilTekst[dekkesUtgiftenAvAndre.lønnetAktivitet]}
                />
            )}
        </InfoSeksjon>
    );
};
