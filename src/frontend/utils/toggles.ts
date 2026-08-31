export enum Toggle {
    /**
     * Kan opprette saksbehandling
     */
    KAN_SAKSBEHANDLE_PASS_AV_BARN = 'sak.frontend.kan-saksbehandle.barnetilsyn',
    KAN_SAKSBEHANDLE_LÆREMIDLER = 'sak.frontend.kan-saksbehandle.laremidler',
    KAN_SAKSBEHANDLE_BOUTGIFTER = 'sak.frontend.kan-saksbehandle.boutgifter',
    KAN_SAKSBEHANDLE_DAGLIG_REISE_TSO = 'sak.frontend.kan-saksbehandle.daglig-reise-tso',
    KAN_SAKSBEHANDLE_DAGLIG_REISE_TSR = 'sak.frontend.kan-saksbehandle.daglig-reise-tsr',
    KAN_SAKSBEHANDLE_REISE_TIL_SAMLING_TSO = 'sak.frontend.kan-saksbehandle.reise-til-samling-tso',
    KAN_SAKSBEHANDLE_REISE_TIL_SAMLING_TSR = 'sak.frontend.kan-saksbehandle.reise-til-samling-tsr',
    KAN_SAKSBEHANDLE_FLYTTING_TSO = 'sak.frontend.kan-saksbehandle.flytting-tso',
    KAN_SAKSBEHANDLE_FLYTTING_TSR = 'sak.frontend.kan-saksbehandle.flytting-tsr',
    KAN_SAKSBEHANDLE_STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO = 'sak.frontend.kan-saksbehandle.stotte-til-reise-oppstart-avslutning-hjemreise-tso',
    KAN_SAKSBEHANDLE_STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR = 'sak.frontend.kan-saksbehandle.stotte-til-reise-oppstart-avslutning-hjemreise-tsr',
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
    KAN_OVERSKRIDE_ANTALL_DAGER_I_RAMMEVEDTAK = 'sak.kan-overskride-antall-dager-i-rammevedtak',
    KAN_OPPHØRE_DAGLIG_REISE_TSO = 'sak.frontend.kan-oppheve-daglig-reise-tso',
    KAN_OPPRETTE_MANUELL_KJØRELISTEBEHANDLING = 'sak.frontend.kan-opprette-manuell-kjorelistebehandling',
    KAN_BEHANDLE_REISE_TIL_SAMLING = 'sak.reise-til-samling',
    KAN_BEHANDLE_FLYTTING = 'sak.flytting',
}
