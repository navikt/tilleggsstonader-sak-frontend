import { Valg } from './typer';

export const idEllerFritekst = (valg: Valg): string => {
    switch (valg._type) {
        case 'tekst':
            return valg._id;
        case 'fritekst':
            return 'fritekst';
    }
};
