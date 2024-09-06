import React from 'react';

import { Alert, Detail, HelpText, HStack, Link, VStack } from '@navikt/ds-react';

import RegisterYtelserTabell from './RegisterYtelserTabell';
import { useBehandling } from '../../../../context/BehandlingContext';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { VilkårperioderGrunnlag, YtelseGrunnlagPeriode } from '../typer/vilkårperiode';

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

    const opplysningerHentetTekst = `Hentet fra Arena: ${formaterNullableIsoDatoTid(hentetInformasjon.tidspunktHentet)}`;

    if (perioderMedYtelse.length === 0) {
        return (
            <Alert variant={'info'} inline size="small">
                Vi finner ingen relevante ytelser registrert på bruker fra og med{' '}
                {formaterNullableIsoDato(hentetInformasjon.fom)} til og med{' '}
                {formaterNullableIsoDato(hentetInformasjon.tom)}
                <Detail>{opplysningerHentetTekst}</Detail>
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
                    <VStack>
                        <HStack gap="2" align="center">
                            <Detail>
                                <strong>{opplysningerHentetTekst}</strong>
                            </Detail>
                            <HelpText>
                                Vi henter kun perioder med arbeidsavklaringspenger, rett til
                                overgangsstønad og omstillingsstønad.
                            </HelpText>
                        </HStack>
                        <Detail>
                            <Link
                                href={`/person/${behandling.fagsakPersonId}/ytelser`}
                                target="_blank"
                                variant={'neutral'}
                            >
                                Se flere ytelser bruker mottar
                            </Link>{' '}
                            i personoversikten.
                        </Detail>
                    </VStack>
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

export default RegisterYtelser;
