import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack } from '@navikt/ds-react';

import Begrunnelse from './Begrunnelse';
import { finnBegrunnelseGrunner } from './utils';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { Feilmelding } from '../../../../../komponenter/Feil/Feilmelding';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions, { SelectOption } from '../../../../../komponenter/Skjema/SelectMedOptions';
import { EndreAktivitetForm } from '../../Aktivitet/EndreAktivitetRad';
import { EndreMålgruppeForm } from '../../Målgruppe/EndreMålgruppeRad';
import { Aktivitet } from '../../typer/aktivitet';
import { Målgruppe } from '../../typer/målgruppe';
import { KildeVilkårsperiode, VilkårPeriode } from '../../typer/vilkårperiode';
import SlettVilkårperiodeModal from '../SlettVilkårperiodeModal';
import { EndreVilkårsperiode } from '../validering';
import VilkårperiodeKortBase from '../VilkårperiodeKort/VilkårperiodeKortBase';

const FeltContainer = styled.div`
    flex-grow: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    heigth: max-content;

    align-self: start;
    align-items: start;
`;

interface Props {
    vilkårperiode?: Målgruppe | Aktivitet;
    form: EndreMålgruppeForm | EndreAktivitetForm;
    avbrytRedigering: () => void;
    lagre: () => void;
    oppdaterForm: (key: keyof VilkårPeriode, nyVerdi: string) => void;
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
    oppdaterForm,
    oppdaterType,
    typeOptions,
    vilkårsperiodeFeil,
    ekstraCeller,
    feilmelding,
    children,
}) => {
    const [visSlettModal, settVisSlettModal] = useState(false);

    const delvilkårSomKreverBegrunnelse = finnBegrunnelseGrunner(form);

    return (
        <VilkårperiodeKortBase vilkårperiode={vilkårperiode} redigeres>
            <FeltContainer>
                <SelectMedOptions
                    label="Ytelse/situasjon"
                    readOnly={vilkårperiode !== undefined}
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
                    onChange={(dato) => oppdaterForm('fom', dato || '')}
                    size="small"
                    feil={vilkårsperiodeFeil?.fom}
                />

                <DateInputMedLeservisning
                    erLesevisning={vilkårperiode?.kilde === KildeVilkårsperiode.SYSTEM}
                    label={'Til'}
                    value={form?.tom}
                    onChange={(dato) => oppdaterForm('tom', dato || '')}
                    size="small"
                    feil={vilkårsperiodeFeil?.tom}
                />

                {ekstraCeller}
            </FeltContainer>

            {children}

            <Begrunnelse
                begrunnelse={form?.begrunnelse || ''}
                oppdaterBegrunnelse={(nyBegrunnelse) => oppdaterForm('begrunnelse', nyBegrunnelse)}
                delvilkårSomKreverBegrunnelse={delvilkårSomKreverBegrunnelse}
                feil={vilkårsperiodeFeil?.begrunnelse}
            />
            <HStack gap="4">
                <Button size="xsmall" onClick={lagre}>
                    Lagre
                </Button>

                <Button onClick={avbrytRedigering} variant="secondary" size="xsmall">
                    Avbryt
                </Button>
                {vilkårperiode !== undefined && (
                    <>
                        <Button
                            size="small"
                            variant={'tertiary'}
                            onClick={() => settVisSlettModal(true)}
                        >
                            Slett
                        </Button>
                        <SlettVilkårperiodeModal
                            avbrytRedigering={avbrytRedigering}
                            visModal={visSlettModal}
                            settVisModal={settVisSlettModal}
                            vilkårperiode={vilkårperiode}
                        />
                    </>
                )}
            </HStack>

            <Feilmelding>{feilmelding}</Feilmelding>
        </VilkårperiodeKortBase>
    );
};

export default EndreVilkårperiodeRad;
