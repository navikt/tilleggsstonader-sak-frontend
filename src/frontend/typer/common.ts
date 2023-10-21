// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialKeys<K extends keyof any> = [K];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export type KeysOfValueOrUndefined<T, TCondition> = {
    [K in keyof T]-?: T[K] extends TCondition | undefined ? K : never;
}[keyof T];

export type StringOrUndefinedKeys<T> = KeysOfValueOrUndefined<T, string>;
