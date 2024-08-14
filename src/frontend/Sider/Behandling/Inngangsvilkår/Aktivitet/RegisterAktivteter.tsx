import React from 'react';

import { Alert, Detail, HStack, HelpText, VStack } from '@navikt/ds-react';

import RegisterAktiviteterTabell from './RegisterAktivteterTabell';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { VilkårperioderGrunnlag } from '../typer/vilkårperiode';

const RegisterAktiviteter: React.FC<{
    grunnlag: VilkårperioderGrunnlag | undefined;
    leggTilAktivitetFraRegister: (aktivitet: Registeraktivitet) => void;
}> = ({ grunnlag, leggTilAktivitetFraRegister }) => {
    if (!grunnlag) {
        return (
            <Alert variant={'info'} inline size="small">
                Det ble ikke hentet aktiviteter fra register for denne behandlingen
            </Alert>
        );
    }

    const aktiviteter = grunnlag.aktivitet.aktiviteter;
    const hentetInformasjon = grunnlag.hentetInformasjon;

    const opplysningerHentetTekst = `Hentet fra Arena: ${formaterNullableIsoDatoTid(hentetInformasjon.tidspunktHentet)}`;

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
            <ExpansionCard
                tittel={`Relevante aktiviteter registrert på bruker fra og med ${formaterNullableIsoDato(hentetInformasjon.fom)}`}
                maxWidth={800}
            >
                <VStack gap="4">
                    <RegisterAktiviteterTabell
                        aktiviteter={aktiviteter}
                        leggTilAktivitetFraRegister={leggTilAktivitetFraRegister}
                    />
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
