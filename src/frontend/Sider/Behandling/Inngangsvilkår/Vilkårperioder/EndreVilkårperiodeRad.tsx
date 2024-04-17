import React from 'react';

import styled from 'styled-components';

import { Button, HStack, Textarea } from '@navikt/ds-react';

import { EndreVilkårsperiode } from './validering';
import VilkårperiodeKortBase from './VilkårperiodeKort/VilkårperiodeKortBase';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions, { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';
import { EndreAktivitetForm } from '../Aktivitet/EndreAktivitetRad';
import { EndreMålgruppeForm } from '../Målgruppe/EndreMålgruppeRad';
import { Aktivitet } from '../typer/aktivitet';
import { Målgruppe } from '../typer/målgruppe';
import { KildeVilkårsperiode, VilkårPeriode } from '../typer/vilkårperiode';

const FeltContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    heigth: max-content;

    align-self: start;
    align-items: center;
`;

interface Props {
    vilkårperiode?: Målgruppe | Aktivitet;
    form: EndreMålgruppeForm | EndreAktivitetForm;
    avbrytRedigering: () => void;
    lagre: () => void;
    oppdaterVilkårperiode: (key: keyof VilkårPeriode, nyVerdi: string) => void;
    oppdaterType: (nyttvalg: string) => void;
    typeOptions: SelectOption[];
    vilkårsperiodeFeil?: FormErrors<EndreVilkårsperiode>;
    ekstraCeller?: React.ReactNode;
    feilmelding?: string;
    children: React.ReactNode;
}

// TODO: Endre navn til EndreVilkårperiodeKort eller EndreVilkårperiode
const EndreVilkårperiodeRad: React.FC<Props> = ({
    vilkårperiode,
    form,
    avbrytRedigering,
    lagre,
    oppdaterVilkårperiode,
    oppdaterType,
    typeOptions,
    vilkårsperiodeFeil,
    ekstraCeller,
    feilmelding,
    children,
}) => {
    return (
        <VilkårperiodeKortBase vilkårperiode={vilkårperiode} redigeres>
            <FeltContainer>
                <SelectMedOptions
                    label="Ytelse/situasjon"
                    erLesevisning={vilkårperiode !== undefined}
                    value={form.type}
                    valg={typeOptions}
                    onChange={(e) => oppdaterType(e.target.value)}
                    size="small"
                    error={vilkårsperiodeFeil?.type}
                />

                <DateInputMedLeservisning
                    erLesevisning={vilkårperiode?.kilde === KildeVilkårsperiode.SYSTEM}
                    label={'Fra'}
                    value={form?.fom}
                    onChange={(dato) => oppdaterVilkårperiode('fom', dato || '')}
                    size="small"
                    feil={vilkårsperiodeFeil?.fom}
                />

                <DateInputMedLeservisning
                    erLesevisning={vilkårperiode?.kilde === KildeVilkårsperiode.SYSTEM}
                    label={'Til'}
                    value={form?.tom}
                    onChange={(dato) => oppdaterVilkårperiode('tom', dato || '')}
                    size="small"
                    feil={vilkårsperiodeFeil?.tom}
                />

                {ekstraCeller}
            </FeltContainer>

            <HStack gap="8">{children}</HStack>

            {/* TODO: Håndter validering og visning av om begrunnelse er obligatorisk */}
            <Textarea
                label={'Begrunnelse'}
                value={vilkårperiode?.begrunnelse || ''}
                onChange={(e) => oppdaterVilkårperiode('begrunnelse', e.target.value)}
                size="small"
            />
            <HStack gap="4">
                <Button size="xsmall" onClick={lagre}>
                    Lagre
                </Button>

                <Button onClick={avbrytRedigering} variant="secondary" size="xsmall">
                    Avbryt
                </Button>
            </HStack>

            <Feilmelding>{feilmelding}</Feilmelding>
        </VilkårperiodeKortBase>
    );
};

export default EndreVilkårperiodeRad;
