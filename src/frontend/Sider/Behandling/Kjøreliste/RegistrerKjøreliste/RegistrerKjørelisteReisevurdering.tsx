import React, { FC } from 'react';

import { Table } from '@navikt/ds-react';

import { RegistrerKjørelisteUkeRad } from './RegistrerKjørelisteUkeRad';
import {
    RegistrertKjørtUke,
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
    lagreEllerOppdaterUke: (
        reiseId: string,
        ukeId: string | undefined,
        req: RegistrertKjørtUkePutRequest
    ) => Promise<Ressurs<RegistrertKjørtUke>>;
}> = ({ reisevurdering, oppdaterUkeVurdering, registrertKjørtUker, lagreEllerOppdaterUke }) => {
    const finnDelperioderForUke = (uke: UkeVurdering): RammeForReiseMedPrivatBilDelperiode[] => {
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
                        delperioder={finnDelperioderForUke(uke)}
                        reiseId={reisevurdering.reiseId}
                        registrertKjørtUkerForReise={registrertKjørtUkerForReise}
                        lagreEllerOppdaterUke={lagreEllerOppdaterUke}
                    />
                ))}
            </Table.Body>
        </Table>
    );
};
