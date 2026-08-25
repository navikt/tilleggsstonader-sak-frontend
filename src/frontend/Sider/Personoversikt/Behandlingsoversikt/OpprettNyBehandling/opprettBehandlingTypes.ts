export interface OpprettBehandlingResponseOpprettet {
    status: 'OPPRETTET';
    behandlingId: string;
}

export interface OpprettBehandlingResponseÅpneBehandlinger {
    status: 'ÅPNE_BEHANDLINGER_FUNNET';
}

export type OpprettBehandlingResponse =
    OpprettBehandlingResponseOpprettet | OpprettBehandlingResponseÅpneBehandlinger;

export function erOpprettet(
    response: OpprettBehandlingResponse
): response is OpprettBehandlingResponseOpprettet {
    return response.status === 'OPPRETTET';
}

export function erÅpneBehandlingerFunnet(
    response: OpprettBehandlingResponse
): response is OpprettBehandlingResponseÅpneBehandlinger {
    return response.status === 'ÅPNE_BEHANDLINGER_FUNNET';
}
