// ENUMS
export enum StartOfWeek {
    Monday = 'monday',   // Week starts on Monday
    Sunday = 'sunday',   // Week starts on Sunday
    Saturday = 'saturday' // Week starts on Saturday
}

export enum DrivingSide {
    Left = 'left',  // Left-hand traffic
    Right = 'right' // Right-hand traffic
}

// TYPES
export type CountryName = {
    common: string; // Commonly used name of the country (e.g. "United States")
    official: string; // Official name of the country (e.g. "United States of America")
    nativeName?: Record<string, {
        official: string; // Official name in a native language
        common: string;   // Common name in a native language
    }>;
};

export type Currency = {
    name: string;  // Full name of the currency (e.g. "United States dollar")
    symbol: string; // Currency symbol (e.g. "$")
};

export type LanguageMap = Record<string, string>; // Language code mapped to its full name

export type TranslationMap = Record<string, {
    official: string; // Official name in another language
    common: string;   // Common name in another language
}>;

export type Maps = {
    googleMaps: string; // Link to the country's location on Google Maps
    openStreetMaps: string; // Link to the country's location on OpenStreetMap
};

export type Demonym = {
    f: string; // Female form (e.g. "American")
    m: string; // Male form (e.g. "American")
};

export type DemonymsMap = Record<string, Demonym>; // Language → Demonym mapping

export type Flag = {
    svg: string; // URL to the SVG version of the flag
    png: string; // URL to the PNG version of the flag
    alt?: string; // Alt text describing the flag
};

export type CoatOfArms = {
    svg?: string; // URL to the SVG version of the coat of arms
    png?: string; // URL to the PNG version of the coat of arms
};

export type CarInfo = {
    signs?: string[]; // Country code(s) used on vehicle plates (e.g. "USA")
    side: DrivingSide; // Side of the road where people drive
};

export type PostalCode = {
    format: string | null; // Postal code format (e.g. "#####-####")
    regex: string | null;  // Regex for validating postal codes
};

export type IDD = {
    root: string;         // Root dialing code (e.g. "+1")
    suffixes?: string[];  // Area-specific suffixes (e.g. ["202", "303"])
};

export type LatLng = [number, number]; // [latitude, longitude]

// MAIN COUNTRY TYPE
export type Country = {
    name: CountryName; // Common, official, and native names
    tld?: string[]; // Top-level domain(s) (e.g. [".us"])
    cca2: string; // ISO 3166-1 alpha-2 code (e.g. "US")
    ccn3?: string; // ISO 3166-1 numeric code (e.g. "840")
    cca3: string; // ISO 3166-1 alpha-3 code (e.g. "USA")
    cioc?: string; // IOC code (used in the Olympics)
    fifa?: string; // FIFA country code (used in football)
    independent?: boolean; // Indicates if the country is independent
    status: string; // Official status (e.g. "officially-assigned")
    unMember: boolean; // Whether the country is a UN member
    currencies?: Record<string, Currency>; // Currencies used by the country
    idd: IDD; // International direct dialing codes
    capital?: string[]; // Name(s) of the capital city
    capitalInfo?: {
        latlng?: LatLng; // Coordinates of the capital city
    };
    altSpellings?: string[]; // Alternative spellings or abbreviations
    region: string; // Broad region (e.g. "Americas", "Europe")
    subregion?: string; // More specific region (e.g. "North America")
    continents: string[]; // Continents the country is part of
    languages?: LanguageMap; // Languages spoken (by code and name)
    translations: TranslationMap; // Country name translations
    latlng: LatLng; // Coordinates of the geographic center
    landlocked: boolean; // Whether the country has no coastline
    borders?: string[]; // List of bordering countries (ISO 3166-1 alpha-3)
    area: number; // Area in square kilometers
    flag?: string; // Unicode flag emoji (e.g. 🇺🇸)
    demonyms?: DemonymsMap; // National identity terms (e.g. American)
    flags: Flag; // Flag images and alt text
    coatOfArms?: CoatOfArms; // Coat of arms images
    population: number; // Number of inhabitants
    maps: Maps; // Links to maps
    gini?: Record<string, number>; // GINI index (income inequality), keyed by year
    car?: CarInfo; // Vehicle registration and driving side
    postalCode?: PostalCode; // Postal code formatting info
    startOfWeek: StartOfWeek; // Which day is considered the start of the week
    timezones: string[]; // List of timezones in the country
};

export type City = {
    id: number;
    name: string;
    lat: number;
    lon: number;
    type: string;
    population?: number;
};
