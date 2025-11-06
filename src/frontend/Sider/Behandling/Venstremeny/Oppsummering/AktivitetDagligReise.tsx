import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet';
import {
    dagligReiseTypeUtdanningTilTekst,
    FaktaAktivitetDagligReise,
} from '../../../../typer/behandling/behandlingFakta/faktaAktivitet';
import { jaNeiTilTekst } from '../../../../typer/common';
import { formaterIsoPeriodeMedTankestrek } from '../../../../utils/dato';

const AktivitetDagligReise: React.FC<{ aktiviteter: FaktaAktivitetDagligReise }> = ({
    aktiviteter,
}) => {
    const reiseperiode = aktiviteter.reiseperiode;
    const dekkesUtgiftenAvAndre = aktiviteter.aktivitet.søknadsgrunnlag?.dekkesUtgiftenAvAndre;

    return (
        <div>
            <VStack gap="2">
                {aktiviteter && (
                    <VStack>
                        <Aktivitet aktivitet={aktiviteter.aktivitet}></Aktivitet>
                    </VStack>
                )}
                {reiseperiode && (
                    <VStack>
                        <Label size={'small'}>Periode du må reise til aktivitetstedet</Label>
                        <BodyShort size="small">
                            {formaterIsoPeriodeMedTankestrek(reiseperiode)}
                        </BodyShort>
                    </VStack>
                )}
                {dekkesUtgiftenAvAndre?.typeUtdanning && (
                    <VStack>
                        <Label size={'small'}>
                            Hva slags type arbeidsrettet aktivitet går du på?
                        </Label>
                        <BodyShort size="small">
                            {dagligReiseTypeUtdanningTilTekst[dekkesUtgiftenAvAndre.typeUtdanning]}
                        </BodyShort>
                    </VStack>
                )}
                {dekkesUtgiftenAvAndre?.lærling && (
                    <VStack>
                        <Label size={'small'}>
                            Er du lærling, lærekandidat, praksisbrevkandidat eller kandidat for
                            fagbrev på jobb?
                        </Label>
                        <BodyShort size="small">
                            {jaNeiTilTekst[dekkesUtgiftenAvAndre.lærling]}
                        </BodyShort>
                    </VStack>
                )}
                {dekkesUtgiftenAvAndre?.arbeidsgiverDekkerUtgift && (
                    <VStack>
                        <Label size={'small'}>
                            Får du dekket reisen til aktivitetsstedet av arbeidsgiveren din?
                        </Label>
                        <BodyShort size="small">
                            {jaNeiTilTekst[dekkesUtgiftenAvAndre.arbeidsgiverDekkerUtgift]}
                        </BodyShort>
                    </VStack>
                )}
                {dekkesUtgiftenAvAndre?.erUnder25år && (
                    <VStack>
                        <Label size={'small'}>
                            Er/var du under 25 år ved starten av skoleåret?
                        </Label>
                        <BodyShort size="small">
                            {jaNeiTilTekst[dekkesUtgiftenAvAndre.erUnder25år]}
                        </BodyShort>
                    </VStack>
                )}
                {dekkesUtgiftenAvAndre?.betalerForReisenTilSkolenSelv && (
                    <VStack>
                        <Label size={'small'}>Må du betale for reisen til skolen selv?</Label>
                        <BodyShort size="small">
                            {jaNeiTilTekst[dekkesUtgiftenAvAndre.betalerForReisenTilSkolenSelv]}
                        </BodyShort>
                    </VStack>
                )}
                {dekkesUtgiftenAvAndre?.lønnetAktivitet && (
                    <VStack>
                        <Label size={'small'}>Mottar du ordinær lønn gjennom tiltaket?</Label>
                        <BodyShort size="small">
                            {jaNeiTilTekst[dekkesUtgiftenAvAndre.lønnetAktivitet]}
                        </BodyShort>
                    </VStack>
                )}
            </VStack>
        </div>
    );
};

export default AktivitetDagligReise;
