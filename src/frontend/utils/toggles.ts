export enum Toggle {
    /**
     * Kan opprette saksbehandling
     */
    KAN_SAKSBEHANDLE_BARNETILSYN = 'sak.frontend.kan-saksbehandle.barnetilsyn',
    KAN_SAKSBEHANDLE_LÆREMIDLER = 'sak.frontend.kan-saksbehandle.laremidler',
    KAN_SAKSBEHANDLE_BOUTGIFTER = 'sak.frontend.kan-saksbehandle.boutgifter',
    KAN_SAKSBEHANDLE_DAGLIG_REISE_TSO = 'sak.frontend.kan-saksbehandle.daglig-reise-tso',
    KAN_SAKSBEHANDLE_DAGLIG_REISE_TSR = 'sak.frontend.kan-saksbehandle.daglig-reise-tsr',
    KAN_SAKSBEHANDLE_REISE_TIL_SAMLING_TSO = 'sak.frontend.kan-saksbehandle.reise-til-samling-tso',
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
    BRUK_DYNAMISK_KART = 'sak.frontend.bruk-dynamisk-kart',
    KAN_BEHANDLE_PRIVAT_BIL = 'sak.daglig-reise-privat-bil',
    KAN_OPPHØRE_DAGLIG_REISE_TSO = 'sak.frontend.kan-oppheve-daglig-reise-tso',
}
