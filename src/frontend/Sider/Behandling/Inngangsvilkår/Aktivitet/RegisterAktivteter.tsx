import React from 'react';

import { Alert, BodyShort, Detail, HelpText, HStack, Link, VStack } from '@navikt/ds-react';

import RegisterAktiviteterTabell from './RegisterAktivteterTabell';
import { useBehandling } from '../../../../context/BehandlingContext';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { Behandling } from '../../../../typer/behandling/behandling';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { VilkårperioderGrunnlag } from '../typer/vilkårperiode/vilkårperiode';

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
                <Hjelpetekst
                    behandling={behandling}
                    tidspunktHentet={hentetInformasjon.tidspunktHentet}
                />
            </Alert>
        );
    }
    return (
        <ExpansionCard
            tittel={`Aktiviteter hentet fra Arena fra og med ${formaterNullableIsoDato(hentetInformasjon.fom)}`}
            maxWidth={1200}
        >
            <VStack gap="4">
                <RegisterAktiviteterTabell
                    registerAktivitet={aktiviteter}
                    leggTilAktivitetFraRegister={leggTilAktivitetFraRegister}
                />
                <Hjelpetekst
                    behandling={behandling}
                    tidspunktHentet={hentetInformasjon.tidspunktHentet}
                />
            </VStack>
        </ExpansionCard>
    );
};

function Hjelpetekst({
    behandling,
    tidspunktHentet,
}: {
    behandling: Behandling;
    tidspunktHentet: string;
}) {
    return (
        <HStack gap="2" align="center">
            <Detail>
                <strong>Hentet fra Arena: {formaterNullableIsoDatoTid(tidspunktHentet)}</strong>
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
                    måneder (3 for tilsyn barn, 6 for læremidler). I en revurdering hentes grunnlag
                    fra og med revurder-fra datoet.
                </BodyShort>
                <BodyShort spacing>
                    I en førstegangsbehandling kan man overstyre datoet man henter grunnlaget fra.
                </BodyShort>
            </HelpText>
        </HStack>
    );
}

export default RegisterAktiviteter;
