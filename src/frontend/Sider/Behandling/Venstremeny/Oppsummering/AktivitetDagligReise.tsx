import React from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';

import { AktivitetFelt } from './Aktivitet';
import { SøknadInfoFelt, SøknadInfoSeksjon } from './Visningskomponenter';
import {
    dagligReiseTypeUtdanningTilTekst,
    FaktaAktivitetDagligReise,
} from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';
import { jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';
import { tekstMedFallback } from '../../../../utils/tekstformatering';

export const AktivitetDagligReise: React.FC<{
    aktiviteter: FaktaAktivitetDagligReise;
}> = ({ aktiviteter }) => {
    const reiseperiode = aktiviteter.reiseperiode;
    const dekkesUtgiftenAvAndre = aktiviteter.aktivitet.søknadsgrunnlag?.dekkesUtgiftenAvAndre;

    if (!aktiviteter.aktivitet.søknadsgrunnlag) {
        return null;
    }

    return (
        <SøknadInfoSeksjon label="Arbeidsrettet aktivitet" ikon={<BriefcaseIcon />}>
            <AktivitetFelt aktivitet={aktiviteter.aktivitet} />
            {reiseperiode && (
                <SøknadInfoFelt
                    label="Periode du må reise til aktivitetsstedet"
                    value={formaterIsoPeriodeMedTankestrek(reiseperiode)}
                />
            )}
            {dekkesUtgiftenAvAndre?.typeUtdanning && (
                <SøknadInfoFelt
                    label="Hva slags type arbeidsrettet aktivitet går du på?"
                    value={tekstMedFallback(
                        dagligReiseTypeUtdanningTilTekst,
                        dekkesUtgiftenAvAndre.typeUtdanning
                    )}
                />
            )}
            {dekkesUtgiftenAvAndre?.lærling && (
                <SøknadInfoFelt
                    label="Er du lærling, lærekandidat, praksisbrevkandidat eller kandidat for fagbrev på jobb?"
                    value={tekstMedFallback(jaNeiTilTekst, dekkesUtgiftenAvAndre.lærling)}
                />
            )}
            {dekkesUtgiftenAvAndre?.arbeidsgiverDekkerUtgift && (
                <SøknadInfoFelt
                    label="Får du dekket reisen til aktivitetsstedet av arbeidsgiveren din?"
                    value={tekstMedFallback(
                        jaNeiTilTekst,
                        dekkesUtgiftenAvAndre.arbeidsgiverDekkerUtgift
                    )}
                />
            )}
            {dekkesUtgiftenAvAndre?.erUnder25år && (
                <SøknadInfoFelt
                    label="Er eller var du under 25 år ved starten av skoleåret?"
                    value={tekstMedFallback(jaNeiTilTekst, dekkesUtgiftenAvAndre.erUnder25år)}
                />
            )}
            {dekkesUtgiftenAvAndre?.betalerForReisenTilSkolenSelv && (
                <SøknadInfoFelt
                    label="Må du betale for reisen til skolen selv?"
                    value={tekstMedFallback(
                        jaNeiTilTekst,
                        dekkesUtgiftenAvAndre.betalerForReisenTilSkolenSelv
                    )}
                />
            )}
            {dekkesUtgiftenAvAndre?.lønnetAktivitet && (
                <SøknadInfoFelt
                    label="Mottar du ordinær lønn gjennom tiltaket?"
                    value={tekstMedFallback(jaNeiTilTekst, dekkesUtgiftenAvAndre.lønnetAktivitet)}
                />
            )}
        </SøknadInfoSeksjon>
    );
};
