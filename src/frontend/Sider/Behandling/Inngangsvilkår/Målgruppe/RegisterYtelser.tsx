import React from 'react';

import { Alert, BodyShort, Detail, HelpText, HStack, Link, VStack } from '@navikt/ds-react';

import RegisterYtelserTabell from './RegisterYtelserTabell';
import { useBehandling } from '../../../../context/BehandlingContext';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { Behandling } from '../../../../typer/behandling/behandling';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
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
                <Hjelpetekst
                    behandling={behandling}
                    tidspunktHentet={hentetInformasjon.tidspunktHentet}
                />
            </Alert>
        );
    }

    return (
        <VStack>
            <ExpansionCard
                tittel={`Relevante ytelser registrert på bruker fra og med ${formaterNullableIsoDato(hentetInformasjon.fom)}`}
                maxWidth={600}
            >
                <VStack gap="4">
                    <RegisterYtelserTabell
                        perioderMedYtelse={perioderMedYtelse}
                        lagRadForPeriode={lagRadForPeriode}
                    />
                    <Hjelpetekst
                        behandling={behandling}
                        tidspunktHentet={hentetInformasjon.tidspunktHentet}
                    />
                </VStack>
            </ExpansionCard>
        </VStack>
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
                    Vi henter kun perioder med arbeidsavklaringspenger, rett til overgangsstønad og
                    omstillingsstønad.
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

export default RegisterYtelser;
