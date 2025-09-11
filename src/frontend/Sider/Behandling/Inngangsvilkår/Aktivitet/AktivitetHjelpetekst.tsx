import React from 'react';

import { BodyLong, ReadMore } from '@navikt/ds-react';

import { useBehandling } from '../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

export function AktivitetHjelpetekst() {
    const { behandling } = useBehandling();

    switch (behandling.stønadstype) {
        case Stønadstype.LÆREMIDLER:
            return hjelpetekstLæremidler;
        default:
            return null;
    }
}

const hjelpetekstLæremidler = (
    <>
        <ReadMore header="Slik gjør du vurderingen" size="small">
            <BodyLong size={'small'} spacing>
                Du skal bare trykke &#34;Bruk&#34; på aktiviteter som er utdanning eller opplæring.
                For målgruppe nedsatt arbeidsevne, vil dette si tiltak etter tiltaksforskriften
                kapittel 7. Hvis du er i tvil om tiltaket er et opplæringstiltak, må du sjekke
                vedtaket om tildeling av arbeidsmarkedstiltak.
            </BodyLong>
            <BodyLong size={'small'} spacing>
                Hvis søker ikke har noe arbeidsrettet aktivitet eller deltar i tiltak som ikke er av
                type opplæring, velger du &#34;Ingen utdanning/opplæringstiltak&#34;.
            </BodyLong>
            <BodyLong size={'small'}>
                Merk at enslige mor eller far som gjennomfører utdanning/opplæring som er tildelt
                som arbeidsmarkedstiltak etter tiltaksforskriften kapittel 7 ikke har rett til
                stønad til læremidler. Du skal derfor også velge &#34;Ingen
                utdanning/opplæringstiltak&#34; for enslige som deltar på opplæringstiltak.
            </BodyLong>
            <a
                href="https://navno.sharepoint.com/sites/TS-sak-Samhandlingmellomsaksbehandlereogutviklingsteam/SitePages/ITHelpdeskHome.aspx"
                target="_blank"
                rel="noopener noreferrer"
            >
                Brukermanualen
            </a>
        </ReadMore>
    </>
);
