export enum Toggle {
    /**
     * Kan opprette saksbehandling og revurdering
     */
    KAN_SAKSBEHANDLE_BARNETILSYN = 'sak.frontend.kan-saksbehandle.barnetilsyn',
    KAN_SAKSBEHANDLE_LÆREMIDLER = 'sak.frontend.kan-saksbehandle.laremidler',
    KAN_REVURDERE_LÆREMIDLER = 'sak.frontend.kan-revurdere.laremidler',
    KAN_SAKSBEHANDLE_BOUTGIFTER = 'sak.frontend.kan-saksbehandle.boutgifter',
    KAN_REVURDERE_BOUTGIFTER = 'sak.frontend.kan-revurdere.boutgifter',
    KAN_REVURDERE_TILSYN_BARN = 'sak.frontend.kan-revurdere.tilsyn-barn',
    KAN_SAKSBEHANDLE_DAGLIG_REISE_TSO = 'sak.frontend.kan-saksbehandle.daglig-reise-tso',
    KAN_REVURDERE_DAGLIG_REISE_TSO = 'sak.frontend.kan-revurdere.daglig-reise-tso',
    KAN_SAKSBEHANDLE_DAGLIG_REISE_TSR = 'sak.frontend.kan-saksbehandle.daglig-reise-tsr',
    KAN_REVURDERE_DAGLIG_REISE_TSR = 'sak.frontend.kan-revurdere.daglig-reise-tsr',

    /**
     * Permission-toggles
     */
    BEHANDLING_ÅRSAK_UTEN_BREV = 'sak.behandling-arsak-uten-brev',
    ADMIN_KAN_OPPRETTE_BEHANDLING = 'sak.admin-kan-opprette-behandling',
    ADMIN_OPPFØLGING = 'sak.hent-behandlinger-for-oppfoelging',

    KAN_REDIGERE_GRUNNLAG_FOM = 'sak.frontend.kan-redigere-grunnlag-fom',
    VIS_VARSEL_ENDRING_AV_PERIODE = 'sak.frontend.vis-varsel-endring-av-periode',

    /**
     * features-under-utvikling
     */
    KAN_HA_FLERE_BEHANDLINGER_PÅ_SAMME_FAGSAK = 'sak.kan-ha-flere-behandlinger-pa-samme-fagsak',
    VIS_ENHETER_SOM_KUN_HAR_TS_SAK_MAPPER_I_DEV = 'sak.vis-enheter-som-kun-har-ts-sak-mapper-i-dev',
    VIS_VEDTAKSPERIODER_PAA_BEHANDLING = 'sak.frontend.skal-vise-vedtaksperioder-paa-behandling',
    VIS_KARTSIDE = 'sak.vis-kartside',
}
