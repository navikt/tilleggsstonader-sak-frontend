export type KanOppretteRevurdering =
    | {
          kanOpprettes: true;
      }
    | { kanOpprettes: false; årsak?: KanIkkeOppretteRevurderingÅrsak };

export enum KanIkkeOppretteRevurderingÅrsak {
    ÅPEN_BEHANDLING = 'ÅPEN_BEHANDLING',
    INGEN_BEHANDLING = 'INGEN_BEHANDLING',
}
