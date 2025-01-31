export enum BehandlingÅrsak {
    SØKNAD = 'SØKNAD',
    PAPIRSØKNAD = 'PAPIRSØKNAD',
    NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
    KORRIGERING_UTEN_BREV = 'KORRIGERING_UTEN_BREV',
    MANUELT_OPPRETTET_UTEN_BREV = 'MANUELT_OPPRETTET_UTEN_BREV',
}

export enum HenlagtÅrsak {
    TRUKKET_TILBAKE = 'TRUKKET_TILBAKE',
    FEILREGISTRERT = 'FEILREGISTRERT',
    SKAL_BEHANDLES_I_ARENA = 'SKAL_BEHANDLES_I_ARENA',
    SKAL_BEHANDLES_AV_ANNET_FAGOMRÅDE = 'SKAL_BEHANDLES_AV_ANNET_FAGOMRÅDE',
}

export const henlagtÅrsakTilTekst: Record<HenlagtÅrsak, string> = {
    TRUKKET_TILBAKE: 'Trukket tilbake',
    FEILREGISTRERT: 'Feilregistrert',
    SKAL_BEHANDLES_I_ARENA: 'Skal behandles i arena',
    SKAL_BEHANDLES_AV_ANNET_FAGOMRÅDE: 'Skal behandles av annet fagområde',
};
