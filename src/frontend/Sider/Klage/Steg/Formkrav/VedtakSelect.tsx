import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { IFormkravVilkår } from './typer';
import { FamilieSelect } from '@navikt/familie-form-elements';
import {
    erVedtakFraFagsystemet,
    fagsystemVedtakTilVisningstekst,
    sorterVedtakstidspunktDesc,
} from './utils';
import { FagsystemVedtak } from '../../typer/fagsystemVedtak';
import {
    PåklagetVedtakstype,
    påklagetVedtakstypeTilTekst,
} from '../../typer/klagebehandling/påklagetVedtakstype';

interface IProps {
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vedtak: FagsystemVedtak[];
    vurderinger: IFormkravVilkår;
}

const SelectWrapper = styled.div`
    width: 80%;
`;

export const VedtakSelect: React.FC<IProps> = ({
    settOppdaterteVurderinger,
    vedtak,
    vurderinger,
}) => {
    const handleChange = (valgtElement: string) => {
        if (erVedtakFraFagsystemet(valgtElement)) {
            settOppdaterteVurderinger((prevState) => ({
                ...prevState,
                påklagetVedtak: {
                    eksternFagsystemBehandlingId: valgtElement,
                    påklagetVedtakstype: PåklagetVedtakstype.VEDTAK,
                },
            }));
        } else {
            settOppdaterteVurderinger((prevState) => ({
                ...prevState,
                påklagetVedtak: {
                    påklagetVedtakstype: valgtElement as PåklagetVedtakstype,
                },
            }));
        }
    };

    return (
        <SelectWrapper>
            <FamilieSelect
                label={'Vedtak som er påklaget'}
                onChange={(e) => {
                    handleChange(e.target.value);
                }}
                value={
                    vurderinger.påklagetVedtak.eksternFagsystemBehandlingId ??
                    vurderinger.påklagetVedtak.påklagetVedtakstype
                }
            >
                <option value={PåklagetVedtakstype.IKKE_VALGT}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.IKKE_VALGT]}
                </option>
                {vedtak.sort(sorterVedtakstidspunktDesc).map((valg, index) => (
                    <option key={index} value={valg.eksternBehandlingId}>
                        {fagsystemVedtakTilVisningstekst(valg)}
                    </option>
                ))}
                <option value={PåklagetVedtakstype.UTEN_VEDTAK}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.UTEN_VEDTAK]}
                </option>
            </FamilieSelect>
        </SelectWrapper>
    );
};
