import React from 'react';

import { Tag, Tooltip } from '@navikt/ds-react';

import { Adressebeskyttelse } from '../../typer/personopplysninger';

type AdressebeskyttelserSomSkalVises =
    | Adressebeskyttelse.FORTROLIG
    | Adressebeskyttelse.STRENGT_FORTROLIG
    | Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND;

const tittel = (adressebeskyttelse: AdressebeskyttelserSomSkalVises) => {
    switch (adressebeskyttelse) {
        case Adressebeskyttelse.STRENGT_FORTROLIG:
            return 'Strengt fortrolig';
        case Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND:
            return 'Strengt fortrolig utland';
        case Adressebeskyttelse.FORTROLIG:
            return 'Fortrolig';
    }
};

const tooltip = (adressebeskyttelse: AdressebeskyttelserSomSkalVises) => {
    switch (adressebeskyttelse) {
        case Adressebeskyttelse.STRENGT_FORTROLIG:
            return 'Tidligere kode 6';
        case Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND:
            return 'Tidligere kode 6 utland';
        case Adressebeskyttelse.FORTROLIG:
            return 'Tidligere kode 7';
    }
};

const TagAdressebeskyttelse = ({
    adressebeskyttelse,
}: {
    adressebeskyttelse: Adressebeskyttelse;
}) => {
    if (adressebeskyttelse === Adressebeskyttelse.UGRADERT) {
        return null;
    }
    return (
        <Tooltip content={tooltip(adressebeskyttelse)}>
            <Tag variant={'error'} size={'small'}>
                {tittel(adressebeskyttelse)}
            </Tag>
        </Tooltip>
    );
};

export default TagAdressebeskyttelse;
