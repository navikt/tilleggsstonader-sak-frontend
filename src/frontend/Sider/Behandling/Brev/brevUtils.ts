import { Valg } from './typer';

export const idEllerFritekst = (valg?: Valg): string | undefined => {
    switch (valg?._type) {
        case 'tekst':
            return valg?._id;
        case 'fritekst':
            return 'fritekst';
    }
};
