import { Dispatch, SetStateAction, useState } from 'react';

export interface RecordState<T> {
    value: Record<string, T>;
    setValue: Dispatch<SetStateAction<Record<string, T>>>;
    remove(key: string): void;
    update(key: string, value: T): void;
}

export default function useRecordState<T>(initialState: Record<string, T>): RecordState<T> {
    const [value, setValue] = useState(initialState);

    const remove = (key: string) => {
        const prevValue = { ...value };
        delete prevValue[key];
        setValue(prevValue);
    };

    const update = (key: string, value: T) =>
        setValue((prevState) => ({
            ...prevState,
            [key]: value,
        }));

    return {
        value,
        setValue,
        remove,
        update,
    };
}
