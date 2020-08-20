const Joi = require("@hapi/joi");

const eovList = [
  "oxygen",
  "nutrients",
  "nitrate",
  "phosphate",
  "silicate",
  "inorganicCarbon",
  "dissolvedOrganicCarbon",
  "seaSurfaceHeight",
  "seawaterDensity",
  "potentialTemperature",
  "potentialDensity",
  "speedOfSound",
  "seaIce",
  "seaState",
  "seaSurfaceSalinity",
  "seaSurfaceTemperature",
  "subSurfaceCurrents",
  "subSurfaceSalinity",
  "subSurfaceTemperature",
  "surfaceCurrents",
];
const statusOptions = [
  "deprecated",
  "proposed",
  "withdrawn",
  "notAccepted",
  "accepted",
  "valid",
  "tentative",
  "superseded",
  "retired",
  "pending",
  "final",
  "underDevelopment",
  "required",
  "planned",
  "onGoing",
  "obsolete",
  "historicalArchive",
  "completed",
];

const rolesList = [
  "resourceProvider",
  "custodian",
  "owner",
  "user",
  "distributor",
  "originator",
  "pointOfContact",
  "principalInvestigator",
  "processor",
  "publisher",
  "author",
  "sponsor",
  "coAuthor",
  "collaborator",
  "editor",
  "mediator",
  "rightsHolder",
  "contributor",
  "funder",
  "stakeholder",
];

// const mainLanguage = record.metadata.language;

const possibleLanguages = ["en", "fr"];

const requiredBilingualLanguages = ["en", "fr"];

// Joi validation rule for each possible language, doesnt allow language codes not on list above
possibleLanguagesDefinition = possibleLanguages.reduce((prev, current) => {
  prev[current] = Joi.string();
  return prev;
}, {});

// Joi validation rule for when each of the language codes on requiredBilingualLanguages list are required
possibleLanguagesDefinitionRequired = possibleLanguages.reduce(
  (prev, current) => {
    if (requiredBilingualLanguages.includes(current))
      prev[current] = Joi.string().required();
    else prev[current] = Joi.string();
    return prev;
  },
  {}
);

// Joi validation rule when bilingual is optional
const bilingualOptional = Joi.alternatives().try(
  Joi.object(possibleLanguagesDefinition),
  Joi.string()
);

// Joi validation rule for when bilingual is required
const bilingualRequired = Joi.object(possibleLanguagesDefinitionRequired);

// Joi validation rule for when the value is an array (eg en:['a','b'],fr:['c','d'])
const bilingualOptionalArray = Joi.alternatives().try(
  Joi.object({ en: Joi.array(), fr: Joi.array() }),
  Joi.array()
);

const schema = Joi.object({
  metadata: Joi.object({
    naming_authority: bilingualOptional,
    identifier: Joi.string().required(),
    language: Joi.any().valid("en", "fr").required(),
    maintenance_note: bilingualOptional,
    use_constraints: Joi.object({
      limitations: bilingualOptional,
      license: Joi.object({
        title: Joi.string(),
        code: Joi.string(),
        url: Joi.string().uri(),
      }),
    }),
    comment: bilingualOptional,
    history: bilingualOptional,
  }),
  spatial: Joi.object({
    bbox: Joi.array().length(4),
    polygon: Joi.string(),
    vertical: Joi.array().length(2),
  })
    .or("bbox", "polygon")
    .required(),
  identification: Joi.object({
    title: bilingualRequired.required(),
    abstract: bilingualRequired.required(),
    dates: Joi.object({
      publication: Joi.date(),
      revision: Joi.date(),
      creation: Joi.date(),
    }),
    keywords: Joi.object({
      default: bilingualOptionalArray,
      eov: Joi.array()
        .items(Joi.string().valid(...eovList))
        .min(1)
        .required(),
    }).required(),
    temporal_begin: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
    temporal_end: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
    time_coverage_resolution: Joi.string(),
    temporal_duration: Joi.string(),
    acknowledgement: Joi.string(),
    status: Joi.any().valid(...statusOptions),
    project: bilingualOptionalArray,
  }).required(),

  contact: Joi.array()
    .items({
      roles: Joi.array()
        .items(Joi.string().valid(...rolesList))
        .required(),
      organization: Joi.object({
        name: Joi.string().required(),
        url: Joi.string().uri(),
        address: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
        email: Joi.string().email({ tlds: { allow: false } }),
      }),
      individual: Joi.object({
        name: Joi.string().required(),
        position: Joi.string(),
        country: Joi.string(),
        email: Joi.string().email({ tlds: { allow: false } }),
      }),
    })
    .min(1),
  distribution: Joi.array().items({
    url: Joi.string().uri().required(),
    name: Joi.string(),
    description: bilingualOptional,
  }),
  platform: Joi.object({
    name: bilingualOptional.required(),
    role: Joi.string(),
    authority: Joi.string(),
    id: Joi.alternatives().try(Joi.string(), Joi.number()),
    description: Joi.string(),
    instruments: Joi.array().items({
      id: Joi.alternatives().try(Joi.string(), Joi.number()),
      manufacturer: bilingualOptional,
      version: Joi.alternatives().try(Joi.string(), Joi.number()),
      type: bilingualOptional,
      description: bilingualOptional,
    }),
  }),
});

module.exports = schema;
