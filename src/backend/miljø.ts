interface Miljø {
  builldPath: string;
}

const lokaltMiljø: Miljø = {
  builldPath: "../../dist_development",
};

const devMiljø: Miljø = {
  builldPath: "../../app/build",
};

const prodMiljø: Miljø = {
  builldPath: "../../app/build",
};

const initierMiljøvariabler = (): Miljø => {
  switch (process.env.ENV) {
    case "localhost":
      return lokaltMiljø;
    case "preprod":
      return devMiljø;
    case "prod":
      return prodMiljø;
    default:
      console.warn("Mangler miljøvariabler - setter lokale variabler");
      return lokaltMiljø;
  }
};

export const miljø = initierMiljøvariabler();
