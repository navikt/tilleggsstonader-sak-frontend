import React from 'react';

import { Alert, Detail, HStack, HelpText, VStack } from '@navikt/ds-react';

import RegisterYtelserTabell from './RegisterYtelserTabell';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { VilkårperioderGrunnlag } from '../typer/vilkårperiode';

const RegisterYtelser: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({
    grunnlag,
}) => {
    if (!grunnlag) {
        return (
            <Alert variant={'info'} inline size="small">
                Det ble ikke hentet ytelser fra register for denne behandlingen
            </Alert>
        );
    }

    const perioderMedYtelse = grunnlag.ytelse.perioder;
    const hentetInformasjon = grunnlag.hentetInformasjon;

    const opplysningerHentetTekst = `Opplysninger hentet fra Arena ${formaterNullableIsoDatoTid(hentetInformasjon.tidspunktHentet)} for perioden ${formaterNullableIsoDato(hentetInformasjon.fom)} - ${formaterNullableIsoDato(hentetInformasjon.tom)}`;

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
            <ExpansionCard tittel="Relevante ytelser registrert på bruker" maxWidth={600}>
                <VStack gap="4">
                    <RegisterYtelserTabell perioderMedYtelse={perioderMedYtelse} />
                    <HStack gap="2" align="center">
                        <Detail>
                            <strong>{opplysningerHentetTekst}</strong>
                        </Detail>
                        <HelpText>
                            Vi henter kun perioder med arbeidsavklaringspenger, rett til
                            overgangsstønad og omstillingsstønad.
                        </HelpText>
                    </HStack>
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

export default RegisterYtelser;
