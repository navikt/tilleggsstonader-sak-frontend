import React from 'react';

import { Alert, Detail, HStack, HelpText, VStack, Link } from '@navikt/ds-react';

import RegisterAktiviteterTabell from './RegisterAktivteterTabell';
import { useBehandling } from '../../../../context/BehandlingContext';
import ExpansionCard from '../../../../komponenter/ExpansionCard';
import { Registeraktivitet } from '../../../../typer/registeraktivitet';
import { formaterNullableIsoDato, formaterNullableIsoDatoTid } from '../../../../utils/dato';
import { VilkårperioderGrunnlag } from '../typer/vilkårperiode';

const RegisterAktiviteter: React.FC<{
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
                tittel={`Aktiviteter hentet fra Arena fra og med ${formaterNullableIsoDato(hentetInformasjon.fom)}`}
                maxWidth={1600}
            >
                <VStack gap="4">
                    <RegisterAktiviteterTabell
                        aktiviteterFraArena={aktiviteter}
                        leggTilAktivitetFraRegister={leggTilAktivitetFraRegister}
                    />
                    <VStack>
                        <HStack gap="2" align="center">
                            <Detail>
                                <strong>{opplysningerHentetTekst}</strong>
                            </Detail>
                            <HelpText>
                                Vi henter kun stønadsberettigede aktiviteter fra Arena. Du finner
                                alle aktiviteter i{' '}
                                <Link
                                    href={`/person/${behandling.fagsakPersonId}/aktiviteter`}
                                    target="_blank"
                                    variant={'neutral'}
                                >
                                    personoversikten.
                                </Link>{' '}
                            </HelpText>
                        </HStack>
                    </VStack>
                </VStack>
            </ExpansionCard>
        </VStack>
    );
};

export default RegisterAktiviteter;
