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
