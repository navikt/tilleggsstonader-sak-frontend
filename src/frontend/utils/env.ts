import { Roller } from './roller';

export interface AppEnv {
    roller: Roller;
    unleashEnv: 'mock' | 'development' | 'production';
}

export const hentEnv = (settEnv: (env: AppEnv | undefined) => void) => {
    fetch('/api/env')
        .then((res) => {
            if (res.ok) {
                res.json().then((json) => settEnv(json as AppEnv));
            } else {
                // eslint-disable-next-line no-console
                console.log('Feilet henting av env', res.status);
            }
        })
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.log('Feilet henting av env', err);
        });
};
