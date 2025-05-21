import { Country } from "@app/types";
import countries from "@app/utils/countries.json";
import Fuse from "fuse.js";

const fuse = new Fuse(countries, {
    keys: [
        "name.common",
        "name.official",
        "name.nativeName.*.common",
        "name.nativeName.*.official"
    ],
    threshold: 0.3,
});

export const useWorldCountries = () => {
    const getAllCountries = (): Country[] => countries as unknown as Country[];
    const getCountryByCode = (code: string): Country | undefined =>
        countries.find((country: any) => country.code === code) as Country | undefined;
    const getCountryByName = (searchName: string): Country[] => {
        const normalized = searchName.trim();
        if (!normalized) return [];
        return fuse.search(normalized).map(result => result.item as unknown as Country);
    };

    return {
        getAllCountries,
        getCountryByCode,
        getCountryByName,
    };
};