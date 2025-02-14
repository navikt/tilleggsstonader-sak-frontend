import React, { useEffect } from 'react';

import styled from 'styled-components';

import { BodyShort, HGrid, HStack, VStack } from '@navikt/ds-react';

import { useHentVilkårsvurdering } from '../../../../../hooks/useHentVilkårsvurdering';
import { useVilkårperioder } from '../../../../../hooks/useVilkårperioder';
import DataViewer from '../../../../../komponenter/DataViewer';
import { VilkårsresultatIkon } from '../../../../../komponenter/Ikoner/Vurderingsresultat/VilkårsresultatIkon';
import { BehandlingFaktaTilsynBarn } from '../../../../../typer/behandling/behandlingFakta/behandlingFakta';
import { formaterNullablePeriode } from '../../../../../utils/dato';
import { aktivitetTypeTilTekst } from '../../../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { målgruppeTypeTilTekst } from '../../../Inngangsvilkår/typer/vilkårperiode/målgruppe';
import { VilkårPeriodeResultat } from '../../../Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../../vilkår';

const StyledHGrid = styled(HGrid)<{ bottomBorder?: boolean }>`
    padding-bottom: 1rem;
    ${(props) => props.bottomBorder && `border-bottom: solid 1px white;`}
`;

export const BehandlingInfo: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { vilkårperioderResponse } = useVilkårperioder(behandlingId);
    const { hentVilkårsvurdering, vilkårsvurdering } = useHentVilkårsvurdering();

    useEffect(() => {
        hentVilkårsvurdering(behandlingId);
    }, [behandlingId, hentVilkårsvurdering]);

    const finnBarnNavn = (
        barnId: string | undefined,
        behandlingFakta: BehandlingFaktaTilsynBarn
    ) => {
        return behandlingFakta.barn.find((barn) => barn.barnId === barnId)?.registergrunnlag.navn;
    };

    return (
        <DataViewer response={{ vilkårsvurdering, vilkårperioderResponse }}>
            {({ vilkårsvurdering, vilkårperioderResponse }) => (
                <VStack gap={'6'}>
                    <StyledHGrid bottomBorder columns={'125px auto'}>
                        <BodyShort>Aktivitet</BodyShort>
                        <VStack>
                            {vilkårperioderResponse.vilkårperioder.aktiviteter.map((aktivitet) => (
                                <InfoRad
                                    key={aktivitet.id}
                                    resultat={aktivitet.resultat}
                                    fom={aktivitet.fom}
                                    tom={aktivitet.tom}
                                    gjelder={aktivitetTypeTilTekst(aktivitet.type)}
                                />
                            ))}
                        </VStack>
                    </StyledHGrid>
                    <StyledHGrid bottomBorder columns={'125px auto'}>
                        <BodyShort>Målgruppe</BodyShort>
                        <VStack>
                            {vilkårperioderResponse.vilkårperioder.målgrupper.map((målgruppe) => (
                                <InfoRad
                                    key={målgruppe.id}
                                    resultat={målgruppe.resultat}
                                    fom={målgruppe.fom}
                                    tom={målgruppe.tom}
                                    gjelder={målgruppeTypeTilTekst(målgruppe.type)}
                                />
                            ))}
                        </VStack>
                    </StyledHGrid>
                    <StyledHGrid columns={'125px auto'}>
                        <BodyShort>Pass av barn</BodyShort>
                        <VStack gap={'2'}>
                            {vilkårsvurdering.vilkårsett.map((vilkår) => (
                                <InfoRad
                                    key={vilkår.id}
                                    resultat={vilkår.resultat}
                                    fom={vilkår.fom}
                                    tom={vilkår.tom}
                                    gjelder={finnBarnNavn(
                                        vilkår.barnId,
                                        vilkårsvurdering.grunnlag as BehandlingFaktaTilsynBarn
                                    )}
                                />
                            ))}
                        </VStack>
                    </StyledHGrid>
                </VStack>
            )}
        </DataViewer>
    );
};

interface InfoRadProps {
    resultat: VilkårPeriodeResultat | Vilkårsresultat;
    fom?: string;
    tom?: string;
    gjelder?: string;
}

const InfoRad: React.FC<InfoRadProps> = ({ resultat, fom, tom, gjelder }) => {
    return (
        <HStack gap={'2'} align={'center'}>
            <VilkårsresultatIkon vilkårsresultat={resultat} height={18} width={18} />
            <BodyShort>{`${formaterNullablePeriode(fom, tom)}: ${gjelder}`}</BodyShort>
        </HStack>
    );
};
