import React, { Dispatch, FC, SetStateAction } from 'react';

import styled from 'styled-components';

import { Ingress, Radio, RadioGroup } from '@navikt/ds-react';

import { EBrevmottakerRolle, IBrevmottaker } from './typer';
import { PersonopplysningerIBrevmottakere } from '../../Sider/Behandling/Brev/typer';

const StyledRadioGruppe = styled(RadioGroup)`
    display: flex;

    > div {
        margin-right: 2rem;
    }
`;

const Underoverskrift = styled(Ingress)`
    margin-bottom: 1rem;
`;

interface Props {
    valgteBrevmottakere: IBrevmottaker[];
    settValgtBrevMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    personopplysninger: PersonopplysningerIBrevmottakere;
}
export const SkalBrukerHaBrev: FC<Props> = ({
    valgteBrevmottakere,
    settValgtBrevMottakere,
    personopplysninger,
}) => {
    const brukerSkalHaBrev = valgteBrevmottakere.some(
        (mottaker) => mottaker.mottakerRolle === EBrevmottakerRolle.BRUKER
    );

    const toggleBrukerSkalHaBrev = () => {
        settValgtBrevMottakere((mottakere) => {
            const brukerErIListe = mottakere.some(
                (mottaker) => mottaker.mottakerRolle === EBrevmottakerRolle.BRUKER
            );

            if (brukerErIListe) {
                return mottakere.filter(
                    (mottaker) => mottaker.mottakerRolle !== EBrevmottakerRolle.BRUKER
                );
            } else {
                return [
                    {
                        mottakerRolle: EBrevmottakerRolle.BRUKER,
                        personIdent: personopplysninger.personIdent,
                        navn: personopplysninger.navn,
                    },
                    ...mottakere,
                ];
            }
        });
    };

    return (
        <>
            <Underoverskrift>Skal bruker motta brevet?</Underoverskrift>
            <StyledRadioGruppe
                legend={'Skal bruker motta brevet?'}
                hideLegend
                value={brukerSkalHaBrev ? 'Ja' : 'Nei'}
            >
                <Radio value={'Ja'} name={'brukerHaBrevRadio'} onChange={toggleBrukerSkalHaBrev}>
                    Ja
                </Radio>
                <Radio value={'Nei'} name={'brukerHaBrevRadio'} onChange={toggleBrukerSkalHaBrev}>
                    Nei
                </Radio>
            </StyledRadioGruppe>
        </>
    );
};
