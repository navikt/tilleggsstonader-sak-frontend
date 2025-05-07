import React from 'react';

import { Alert, BodyShort, Detail, HelpText, HStack, Link, VStack } from '@navikt/ds-react';

import RegisterAktiviteterTabell from './RegisterAktivteterTabell';
import { useBehandling } from '../../../../context/BehandlingContext';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { Behandling } from '../../../../typer/behandling/behandling';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import {
    hentetInformasjonAktivitetTilTekst,
    VilkårperioderGrunnlag,
} from '../typer/vilkårperiode/vilkårperiode';

export const RegisterAktiviteter: React.FC<{
    grunnlag: VilkårperioderGrunnlag | undefined;
    leggTilAktivitetFraRegister: (aktivitet: Registeraktivitet) => void;
}> = ({ grunnlag, leggTilAktivitetFraRegister }) => {
    const { behandling } = useBehandling();

    if (!grunnlag) {
        return (
            <Alert variant={'info'} inline size="small">
                Det ble ikke hentet aktiviteter fra register for denne behandlingen
            </Alert>
        );
    }

    const aktiviteter = grunnlag.aktivitet.aktiviteter;
    const hentetInformasjon = grunnlag.hentetInformasjon;

    if (aktiviteter.length === 0) {
        return (
            <Alert variant={'info'} inline size="small">
                Vi fant ingen stønadsberettigede aktiviteteter registrert på bruker.
                <Hjelpetekst behandling={behandling} grunnlag={grunnlag} />
            </Alert>
        );
    }
    return (
        <VStack>
            <ExpansionCard
                tittel={`Aktiviteter hentet fra Arena fra og med ${formaterNullableIsoDato(hentetInformasjon.fom)}`}
                maxWidth={1200}
            >
                <VStack gap="4">
                    <RegisterAktiviteterTabell
                        registerAktivitet={aktiviteter}
                        leggTilAktivitetFraRegister={leggTilAktivitetFraRegister}
                    />
                    <Hjelpetekst behandling={behandling} grunnlag={grunnlag} />
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

function Hjelpetekst({
    behandling,
    grunnlag,
}: {
    behandling: Behandling;
    grunnlag: VilkårperioderGrunnlag;
}) {
    const tidspunktHentet = grunnlag.hentetInformasjon.tidspunktHentet;
    const typer = grunnlag.aktivitet.hentetInformasjon
        .map((hentetInformasjon) => hentetInformasjonAktivitetTilTekst[hentetInformasjon.type])
        .join(', ');
    const feiledeTyper = grunnlag.aktivitet.hentetInformasjon
        .filter((hentetInformasjon) => hentetInformasjon.status !== 'FEILET')
        .map((hentetInformasjon) => hentetInformasjonAktivitetTilTekst[hentetInformasjon.type])
        .join(', ');
    return (
        <VStack gap={'2'}>
            <HStack gap="2" align="center">
                <Detail>
                    <strong>
                        Hentet fra {typer}: {formaterNullableIsoDatoTid(tidspunktHentet)}
                    </strong>
                </Detail>
                <HelpText>
                    <BodyShort spacing>
                        Vi henter kun stønadsberettigede aktiviteter fra Arena. Du finner alle
                        aktiviteter i{' '}
                        <Link
                            href={`/person/${behandling.fagsakPersonId}/aktiviteter`}
                            target="_blank"
                            variant={'neutral'}
                        >
                            personoversikten
                        </Link>
                        .
                    </BodyShort>
                    <BodyShort spacing>
                        Datoet som brukes i en førstegangsbehandling er mottatt tidspunkt minus X
                        måneder (3 for tilsyn barn, 6 for læremidler). I en revurdering hentes
                        grunnlag fra og med revurder-fra datoet.
                    </BodyShort>
                    <BodyShort spacing>
                        I en førstegangsbehandling kan man overstyre datoet man henter grunnlaget
                        fra.
                    </BodyShort>
                </HelpText>
            </HStack>
            {feiledeTyper && (
                <Alert variant={'error'} size="small" style={{ maxWidth: 'fit-content' }}>
                    Feilet henting av aktiviteter fra: {feiledeTyper}. Prøv å hent data på nytt.
                </Alert>
            )}
        </VStack>
    );
}

export default RegisterAktiviteter;
