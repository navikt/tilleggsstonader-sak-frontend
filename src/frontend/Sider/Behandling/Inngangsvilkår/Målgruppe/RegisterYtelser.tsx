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

import RegisterYtelserTabell from './RegisterYtelserTabell';
import { useBehandling } from '../../../../context/BehandlingContext';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { Behandling } from '../../../../typer/behandling/behandling';
import { stønadstypeTilTekst } from '../../../../typer/behandling/behandlingTema';
import { registerYtelseTilTekstStorForbokstav } from '../../../../typer/registerytelser';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { ingenMålgruppeAktivitetAntallMndBakITiden } from '../../Felles/grunnlagAntallMndBakITiden';
import {
    VilkårperioderGrunnlag,
    YtelseGrunnlagPeriode,
} from '../typer/vilkårperiode/vilkårperiode';

const RegisterYtelser: React.FC<{
    grunnlag: VilkårperioderGrunnlag | undefined;
    lagRadForPeriode: (valgPeriode: YtelseGrunnlagPeriode) => void;
}> = ({ grunnlag, lagRadForPeriode }) => {
    const { behandling } = useBehandling();
    if (!grunnlag) {
        return (
            <Alert variant={'info'} inline size="small">
                Det ble ikke hentet ytelser fra register for denne behandlingen
            </Alert>
        );
    }

    const perioderMedYtelse = grunnlag.ytelse.perioder;
    const hentetInformasjon = grunnlag.hentetInformasjon;

    if (perioderMedYtelse.length === 0) {
        return (
            <Alert variant={'info'} inline size="small">
                Vi finner ingen relevante ytelser registrert på bruker fra og med{' '}
                {formaterNullableIsoDato(hentetInformasjon.fom)} til og med{' '}
                {formaterNullableIsoDato(hentetInformasjon.tom)}
                <Hjelpetekst behandling={behandling} grunnlag={grunnlag} />
            </Alert>
        );
    }

    return (
        <VStack>
            <ExpansionCard
                tittel={`Relevante ytelser registrert på bruker fra og med ${formaterNullableIsoDato(hentetInformasjon.fom)}`}
                maxWidth={700}
            >
                <VStack gap="4">
                    <RegisterYtelserTabell
                        perioderMedYtelse={perioderMedYtelse}
                        lagRadForPeriode={lagRadForPeriode}
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
    const typer = grunnlag.ytelse.kildeResultat
        .map((kildeResultat) => registerYtelseTilTekstStorForbokstav[kildeResultat.type])
        .join(', ');
    const feiledeTyper = grunnlag.ytelse.kildeResultat
        .filter((kildeResultat) => kildeResultat.resultat === 'FEILET')
        .map((kildeResultat) => registerYtelseTilTekstStorForbokstav[kildeResultat.type])
        .join(', ');
    return (
        <VStack gap={'2'}>
            <HStack gap="2" align="center">
                <Detail>
                    <strong>Hentet: {formaterNullableIsoDatoTid(tidspunktHentet)}</strong>
                </Detail>
                <HelpText>
                    <BodyShort spacing>
                        Vi henter kun perioder fra {typer}.{' '}
                        <Link
                            href={`/person/${behandling.fagsakPersonId}/ytelser`}
                            target="_blank"
                            variant="neutral"
                            style={{ display: 'inline' }}
                        >
                            Se flere ytelser bruker mottar
                        </Link>{' '}
                        i personoversikten.
                    </BodyShort>
                    {behandling.type === 'FØRSTEGANGSBEHANDLING' ? (
                        <BodyLong>
                            I en førstegangsbehandling for{' '}
                            {stønadstypeTilTekst[behandling.stønadstype].toLowerCase()} hentes
                            målgrupper fra og med mottatt dato minus{' '}
                            {ingenMålgruppeAktivitetAntallMndBakITiden[behandling.stønadstype]}{' '}
                            måneder tilbake i tid.
                        </BodyLong>
                    ) : (
                        <BodyLong spacing>
                            Ved revurdering hentes målgrupper fra den første datoen i forrige
                            vedtak. Dersom{' '}
                            {ingenMålgruppeAktivitetAntallMndBakITiden[behandling.stønadstype]}{' '}
                            måneder tilbake fra opprettelsesdatoen gir en tidligere startdato,
                            brukes den i stedet.
                        </BodyLong>
                    )}
                </HelpText>
            </HStack>
            {feiledeTyper && (
                <Alert variant={'error'} size="small" style={{ maxWidth: 'fit-content' }}>
                    Feilet henting av ytelser fra: {feiledeTyper}. Prøv å hent data på nytt.
                </Alert>
            )}
        </VStack>
    );
}

export default RegisterYtelser;
