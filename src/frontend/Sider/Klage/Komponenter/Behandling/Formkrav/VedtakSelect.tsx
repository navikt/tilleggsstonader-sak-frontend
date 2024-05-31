import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { IFormkravVilkår } from './typer';
import { PåklagetVedtakstype, påklagetVedtakstypeTilTekst } from '../../../App/typer/fagsak';
import { FamilieSelect } from '@navikt/familie-form-elements';
import {
    erVedtakFraFagsystemet,
    fagsystemVedtakTilVisningstekst,
    harManuellVedtaksdato,
    sorterVedtakstidspunktDesc,
} from './utils';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import { Label } from '@navikt/ds-react';
import { erGyldigDato } from '../../../App/utils/dato';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';

interface IProps {
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vedtak: FagsystemVedtak[];
    vurderinger: IFormkravVilkår;
}

const SelectWrapper = styled.div`
    width: 80%;
`;

const DatoWrapper = styled.div`
    margin-top: 1rem;
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

    const manuellVedtaksdato = vurderinger.påklagetVedtak.manuellVedtaksdato;
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

                <option value={PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING]}
                </option>
                <option value={PåklagetVedtakstype.INFOTRYGD_ORDINÆRT_VEDTAK}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.INFOTRYGD_ORDINÆRT_VEDTAK]}
                </option>
                <option value={PåklagetVedtakstype.UTESTENGELSE}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.UTESTENGELSE]}
                </option>
                <option value={PåklagetVedtakstype.UTEN_VEDTAK}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.UTEN_VEDTAK]}
                </option>
            </FamilieSelect>
            {harManuellVedtaksdato(vurderinger.påklagetVedtak.påklagetVedtakstype) && (
                <DatoWrapper>
                    <Label htmlFor={'vedtaksdato'}>Vedtaksdato</Label>
                    <Datovelger
                        label={''}
                        id={'vedtaksdato'}
                        verdi={manuellVedtaksdato}
                        settVerdi={(dato) => {
                            settOppdaterteVurderinger((prevState) => ({
                                ...prevState,
                                påklagetVedtak: {
                                    ...prevState.påklagetVedtak,
                                    manuellVedtaksdato: dato as string,
                                },
                            }));
                        }}
                        feil={
                            manuellVedtaksdato && !erGyldigDato(manuellVedtaksdato)
                                ? 'Ugyldig dato'
                                : undefined
                        }
                        maksDato={new Date()}
                    />
                </DatoWrapper>
            )}
        </SelectWrapper>
    );
};
