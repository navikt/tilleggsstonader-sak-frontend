import React, { FormEvent, useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Search } from '@navikt/ds-react';

import { useApp } from '../context/AppContext';
import { RessursStatus } from '../typer/ressurs';

type Søkeresultat = {
    personIdent: string;
    visningsnavn: string;
    kjønn: Kjønn;
    fagsakPersonId?: string;
};

enum Kjønn {
    KVINNE = 'KVINNE',
    MANN = 'MANN',
    UKJENT = 'UKJENT',
}
const PersonSøk: React.FC = () => {
    const { request } = useApp();
    const navigate = useNavigate();
    const [søkestreng, settSøkestreng] = useState<string>();

    const søkPerson = useCallback(
        (personIdent: string) => {
            request<Søkeresultat, { personIdent: string }>(`/api/sak/sok/person`, 'POST', {
                personIdent: personIdent,
            }).then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    navigate(`/person/${res.data.fagsakPersonId}`);
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Feilet', res);
                }
            });
        },
        [navigate, request]
    );

    const søk = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!søkestreng) return;

        søkPerson(søkestreng);
    };

    return (
        <form role="search" onSubmit={søk}>
            <Search
                variant="simple"
                label="Søk etter fagsak for en person"
                name="søk"
                onChange={settSøkestreng}
                value={søkestreng}
            />
        </form>
    );
};

export default PersonSøk;
