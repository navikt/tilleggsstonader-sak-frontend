import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Alert, Button, Heading, Select, TextField } from '@navikt/ds-react';

import styles from './OpprettDummyBehandling.module.css';
import { useApp } from '../../context/AppContext';
import { Stønadstype, stønadstypeTilTekst } from '../../typer/behandling/behandlingTema';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../typer/ressurs';

export const OpprettDummyBehandling: React.FC = () => {
    const [feil, settFeil] = useState('');
    const [personIdent, settPersonIdent] = useState<string>('');
    const [stønadstype, settStønadstype] = useState<Stønadstype>(Stønadstype.BARNETILSYN);
    const navigate = useNavigate();

    const { request } = useApp();

    const opprettBehandling = () => {
        settFeil('');
        request<string, { personIdent: string; stønadstype: Stønadstype }>(
            `/api/sak/test/opprett-behandling`,
            'POST',
            {
                personIdent: personIdent,
                stønadstype: stønadstype,
            }
        ).then((res: RessursFeilet | RessursSuksess<string>) => {
            if (res.status === RessursStatus.SUKSESS) {
                navigate(`/behandling/${res.data}/`);
            } else {
                settFeil(res.frontendFeilmelding);
            }
        });
    };

    const harSattPersonIdent = personIdent.length === 11;

    return (
        <div className={styles.container}>
            <Heading size={'small'}>Opprett dummybehandling</Heading>
            <div className={styles.formContainer}>
                <TextField
                    label={'Ident'}
                    value={personIdent}
                    onChange={(e) => settPersonIdent(e.target.value)}
                    autoComplete="off"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                />

                <Select
                    value={stønadstype}
                    label="Type"
                    onChange={(event) => {
                        event.persist();
                        settStønadstype(event.target.value as Stønadstype);
                    }}
                >
                    {[
                        Stønadstype.BARNETILSYN,
                        Stønadstype.LÆREMIDLER,
                        Stønadstype.BOUTGIFTER,
                        Stønadstype.DAGLIG_REISE_TSO,
                        Stønadstype.DAGLIG_REISE_TSR,
                    ].map((type) => (
                        <option key={type} value={type}>
                            {stønadstypeTilTekst[type]}
                        </option>
                    ))}
                </Select>

                <Button type={'button'} disabled={!harSattPersonIdent} onClick={opprettBehandling}>
                    Lag behandling
                </Button>
            </div>
            {feil && <Alert variant={'error'}>{feil}</Alert>}
        </div>
    );
};
