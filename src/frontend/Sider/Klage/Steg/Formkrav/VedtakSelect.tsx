import React, { Dispatch, SetStateAction } from 'react';

import { Select, VStack } from '@navikt/ds-react';

import { IFormkravVilkår } from './typer';
import {
    erVedtakFraFagsystemet,
    fagsystemVedtakTilVisningstekst,
    harManuellVedtaksdato,
    sorterVedtakstidspunktDesc,
} from './utils';
import styles from './VedtakSelect.module.css';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { erGyldigDato } from '../../../../utils/dato';
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
        <VStack gap={'4'} className={styles.selectWrapper}>
            <Select
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
                <option value={PåklagetVedtakstype.ARENA_TILBAKEKREVING}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.ARENA_TILBAKEKREVING]}
                </option>
                <option value={PåklagetVedtakstype.ARENA_ORDINÆRT_VEDTAK}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.ARENA_ORDINÆRT_VEDTAK]}
                </option>
                <option value={PåklagetVedtakstype.UTEN_VEDTAK}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.UTEN_VEDTAK]}
                </option>
            </Select>
            {harManuellVedtaksdato(vurderinger.påklagetVedtak.påklagetVedtakstype) && (
                <DateInput
                    label={'Vedtaksdato'}
                    value={manuellVedtaksdato}
                    onChange={(dato) => {
                        settOppdaterteVurderinger((prevState) => ({
                            ...prevState,
                            påklagetVedtak: {
                                ...prevState.påklagetVedtak,
                                manuellVedtaksdato: dato,
                            },
                        }));
                    }}
                    feil={
                        manuellVedtaksdato && !erGyldigDato(manuellVedtaksdato)
                            ? 'Ugyldig dato'
                            : undefined
                    }
                    toDate={new Date()}
                />
            )}
        </VStack>
    );
};
