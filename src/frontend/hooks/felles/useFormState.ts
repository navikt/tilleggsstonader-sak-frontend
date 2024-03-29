// TODO: Se over bruk av any
import { Dispatch, FormEventHandler, SetStateAction, useMemo, useState } from 'react';

import useFieldState, { FieldState } from './useFieldState';
import useListState, { ListState } from './useListState';
import useRecordState, { RecordState } from './useRecordState';

export type FormState<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [P in keyof T]: any;
};
export type InternalFormState<T> = {
    [P in keyof T]: FieldState | ListState<unknown> | RecordState<unknown>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormHook<T extends Record<string, any>> = {
    getProps(key: keyof T): FieldState | ListState<unknown> | RecordState<unknown>;
    errors: FormErrors<T>;
    setErrors: Dispatch<SetStateAction<FormErrors<T>>>;
    nullstillErrors: () => void;
    validateForm: () => boolean;
    onSubmit(fn: (state: FormState<T>) => void): FormEventHandler<HTMLFormElement>;
    customValidate: (fn: Valideringsfunksjon<T>) => boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormErrors<T extends Record<string, any | undefined>> = {
    [P in keyof T]: T[P] extends string | number | undefined
        ? string | undefined
        : FormErrors<T[P]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Valideringsfunksjon<T extends Record<string, any | undefined>> = (
    state: FormState<T>
) => FormErrors<T>;

const tomtErrorState = <T extends Record<string, unknown>>(initialState: FormState<T>) => {
    return Object.keys(initialState).reduce(
        (acc, key) => ({
            ...acc,
            [key]: undefined,
        }),
        {} as FormErrors<T>
    ) as FormErrors<T>;
};

export default function useFormState<T extends Record<string, unknown>>(
    initialState: FormState<T>,
    valideringsfunksjon: Valideringsfunksjon<T>
): FormHook<T> {
    const [errors, setErrors] = useState<FormErrors<T>>(tomtErrorState(initialState));

    const formState: InternalFormState<T> = Object.entries(initialState)
        .map(([key, value]) => {
            if (typeof value === 'string') {
                return { key, value: useFieldState(value) }; // eslint-disable-line
            } else if (Array.isArray(value)) {
                return { key, value: useListState(value) }; // eslint-disable-line
            } else if (typeof value === 'object') {
                return { key, value: useRecordState(value) }; // eslint-disable-line
            } else {
                throw Error(`Støtter ikke den typen: ${key}`);
            }
        })
        .reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as InternalFormState<T>);

    const tilFormstate = useMemo(() => {
        return Object.entries(formState)
            .map(([key, value]) => ({ key, value: value.value }))
            .reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as FormState<T>);
    }, [formState]);

    return {
        getProps: (key: keyof T) => formState[key],
        validateForm: () => {
            const errors = valideringsfunksjon(tilFormstate);
            setErrors(errors);
            return isValid(errors);
        },
        errors,
        setErrors,
        nullstillErrors: () => setErrors(tomtErrorState(initialState)),
        onSubmit(fn: (state: FormState<T>) => void): FormEventHandler<HTMLFormElement> {
            return (event) => {
                event.preventDefault();
                const errors = valideringsfunksjon(tilFormstate);
                setErrors(errors);
                if (isValid(errors)) fn(tilFormstate);
            };
        },
        customValidate(validate) {
            const errors = validate(tilFormstate);
            setErrors(errors);
            return isValid(errors);
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValid<T extends Record<string, any>>(errors: FormErrors<T>): boolean {
    return Object.keys(errors).reduce<boolean>((acc, key) => {
        const value = errors[key];
        if (typeof value === 'object') {
            return acc && isValid(value as FormErrors<T[string]>);
        } else if (Array.isArray(value)) {
            return acc && value.map((v) => isValid(v)).every((result) => result);
        } else if (value === undefined) {
            return acc && true;
        }
        return false;
    }, true);
}
