export enum Toggle {
    /**
     * Kan opprette saksbehandling og revurdering
     */
    KAN_SAKSBEHANDLE_BARNETILSYN = 'sak.frontend.kan-saksbehandle.barnetilsyn',
    KAN_SAKSBEHANDLE_LÆREMIDLER = 'sak.frontend.kan-saksbehandle.laremidler',
    KAN_REVURDERE_LÆREMIDLER = 'sak.frontend.kan-revurdere.laremidler',
    KAN_SAKSBEHANDLE_BOUTGIFTER = 'sak.frontend.kan-saksbehandle.boutgifter',
    KAN_REVURDERE_BOUTGIFTER = 'sak.frontend.kan-revurdere.boutgifter',

    /**
     * Permission-toggles
     */
    BEHANDLING_ÅRSAK_UTEN_BREV = 'sak.behandling-arsak-uten-brev',
    ADMIN_KAN_OPPRETTE_BEHANDLING = 'sak.admin-kan-opprette-behandling',
    ADMIN_OPPFØLGING = 'sak.hent-behandlinger-for-oppfoelging',

    KAN_REDIGERE_GRUNNLAG_FOM = 'sak.frontend.kan-redigere-grunnlag-fom',

    /**
     * features-under-utvikling
     */
    SKAL_BRUKE_MANED_AR_VELGER = 'sak.frontend.skal-bruke-maned-ar-velger',
}
