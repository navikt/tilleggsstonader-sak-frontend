import React, { FC } from 'react';

import { Table } from '@navikt/ds-react';

import { RegistrerKjørelisteUkeRad } from './RegistrerKjørelisteUkeRad';
import {
    RegistrertKjørtUke,
    RegistrertKjørtUkePostRequest,
    RegistrertKjørtUkePutRequest,
    ReisevurderingPrivatBil,
    UkeVurdering,
} from '../../../../typer/kjøreliste';
import { Ressurs } from '../../../../typer/ressurs';
import { RammeForReiseMedPrivatBilDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';

export const RegistrerKjørelisteReisevurdering: FC<{
    reisevurdering: ReisevurderingPrivatBil;
    oppdaterUkeVurdering: (uke: UkeVurdering) => void;
    registrertKjørtUker: RegistrertKjørtUke[];
    lagreRegistrertUke: (
        req: RegistrertKjørtUkePostRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
    oppdaterRegistrertUke: (
        ukeId: string,
        req: RegistrertKjørtUkePutRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
}> = ({
    reisevurdering,
    oppdaterUkeVurdering,
    registrertKjørtUker,
    lagreRegistrertUke,
    oppdaterRegistrertUke,
}) => {
    const delperioderForUke = (uke: UkeVurdering): RammeForReiseMedPrivatBilDelperiode[] => {
        if (uke.erUkeSlettet && reisevurdering.forrigeRammevedtak) {
            return reisevurdering.forrigeRammevedtak.delperioder;
        }
        return reisevurdering.rammevedtak?.delperioder ?? [];
    };

    const registrertKjørtUkerForReise = registrertKjørtUker.filter(
        (u) => u.reiseId === reisevurdering.reiseId
    );

    return (
        <Table size="small">
            <Table.Body>
                {reisevurdering?.uker.map((uke) => (
                    <RegistrerKjørelisteUkeRad
                        uke={uke}
                        key={uke.ukenummer}
                        oppdaterUke={oppdaterUkeVurdering}
                        delperioder={delperioderForUke(uke)}
                        reiseId={reisevurdering.reiseId}
                        registrertKjørtUkerForReise={registrertKjørtUkerForReise}
                        lagreRegistrertUke={lagreRegistrertUke}
                        oppdaterRegistrertUke={oppdaterRegistrertUke}
                    />
                ))}
            </Table.Body>
        </Table>
    );
};
