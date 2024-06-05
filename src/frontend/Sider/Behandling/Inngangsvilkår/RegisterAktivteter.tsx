import React from 'react';

import { Alert, Detail, HStack, HelpText, VStack } from '@navikt/ds-react';

import RegisterAktiviteterTabell from './RegisterAktivteterTabell';
import { VilkårperioderGrunnlag } from './typer/vilkårperiode';
import ExpansionCard from '../../../komponenter/ExpansionCard';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../utils/dato';

const RegisterAktiviteter: React.FC<{ grunnlag: VilkårperioderGrunnlag | undefined }> = ({
    grunnlag,
}) => {
    if (!grunnlag) {
        return (
            <Alert variant={'info'} inline size="small">
                Det ble ikke hentet aktiviteter fra register for denne behandlingen
            </Alert>
        );
    }

    const aktiviteter = grunnlag.aktivitet.aktiviteter;
    const hentetInformasjon = grunnlag.hentetInformasjon;

    const opplysningerHentetTekst = `Opplysninger hentet fra Arena ${formaterNullableIsoDatoTid(hentetInformasjon.tidspunktHentet)} for perioden ${formaterNullableIsoDato(hentetInformasjon.fom)} - ${formaterNullableIsoDato(hentetInformasjon.tom)}`;

    if (aktiviteter.length === 0) {
        return (
            <Alert variant={'info'} inline size="small">
                Vi fant ingen stønadsberettigede aktiviteteter registrert på bruker.
                <Detail>{opplysningerHentetTekst}</Detail>
            </Alert>
        );
    }

    return (
        <VStack>
            <ExpansionCard tittel="Aktiviteter registrert på bruker" maxWidth={800}>
                <VStack gap="4">
                    <RegisterAktiviteterTabell aktiviteter={aktiviteter} />
                    <HStack gap="2" align="center">
                        <Detail>
                            <strong>{opplysningerHentetTekst}</strong>
                        </Detail>
                        <HelpText>
                            Vi henter kun stønadsberettigede aktiviteter fra Arena. Du finner alle
                            aktiviteter i personoversikten.
                        </HelpText>
                    </HStack>
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

export default RegisterAktiviteter;
