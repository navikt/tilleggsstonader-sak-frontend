import React from 'react';

import {
    Alert,
    BodyLong,
    BodyShort,
    Detail,
    HelpText,
    HStack,
    Link,
    VStack,
} from '@navikt/ds-react';

import RegisterAktiviteterTabell from './RegisterAktivteterTabell';
import { useBehandling } from '../../../../context/BehandlingContext';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { Behandling } from '../../../../typer/behandling/behandling';
import { stønadstypeTilTekst } from '../../../../typer/behandling/behandlingTema';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { ingenMålgruppeAktivitetAntallMndBakITiden } from '../../Felles/grunnlagAntallMndBakITiden';
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
                {behandling.type === 'FØRSTEGANGSBEHANDLING' ? (
                    <BodyLong>
                        I en førstegangsbehandling for{' '}
                        {stønadstypeTilTekst[behandling.stønadstype].toLowerCase()} hentes
                        aktiviteter fra og med mottatt dato minus{' '}
                        {ingenMålgruppeAktivitetAntallMndBakITiden[behandling.stønadstype]} måneder
                        tilbake i tid.
                    </BodyLong>
                ) : (
                    <BodyLong spacing>
                        Ved revurdering hentes aktiviteter fra den første datoen i forrige vedtak.
                        Dersom {ingenMålgruppeAktivitetAntallMndBakITiden[behandling.stønadstype]}{' '}
                        måneder tilbake fra opprettelsesdatoen gir en tidligere startdato, brukes
                        den i stedet.
                    </BodyLong>
                )}
            </HelpText>
        </HStack>
    );
}

export default RegisterAktiviteter;
