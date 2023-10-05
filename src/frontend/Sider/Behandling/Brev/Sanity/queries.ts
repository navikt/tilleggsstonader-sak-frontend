import groq from 'groq';

export const hentMalerQuery = groq`*[ytelse == $ytelse && resultat == $resultat]`;

export const malQuery = (id: string, målform: 'bokmål' = 'bokmål') => groq`*[_id == "${id}"][0]{
...,
    "brevtittel": brevtittel.${målform === 'bokmål' ? 'tittelNB' : ''},
    "delmaler": delmaler[]->{
        ..., 
        "blocks": nb[]{ 
            ...,
            _type == "valgfeltReferanse" => valgfelt-> {
                ...,
                valg[] {
                    ...,
                    _type == "reference" => @->{
                        ...,
                        "innhold": nb[]{
                            ...
                        },
                        "variabler": nb[].markDefs[]->
                    }
                }
            }
         }
    }
    
}`;
