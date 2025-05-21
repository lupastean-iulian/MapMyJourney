import { City } from '@app/types';
import axios from 'axios';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

/**
 * Fetches major cities in the selected country using Overpass API
 * @param countryCode Name of the country (e.g. "FR" for France)
 */
export const fetchCitiesByCountry = async (countryCode: string) => {
    const query = `
    [out:json][timeout:25];
    area["ISO3166-1"="${countryCode}"]["admin_level"="2"]->.searchArea;
    (
      node["place"~"city|town"](area.searchArea);
    );
    out body;
  `;

    try {
        const response = await axios.post(OVERPASS_URL, query, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return response.data.elements
            .map((el: any) => ({
                id: el.id,
                name: el.tags?.name,
                lat: el.lat,
                lon: el.lon,
                type: el.tags?.place,
                population: el.tags?.population ? parseInt(el.tags.population) : undefined,
            }))
            .filter((city: City) => city.name); // filter only cities with names
    } catch (error) {
        console.error('Overpass API error:', error);
        throw new Error('Failed to load cities');
    }
};

/**
 * Fetches up to 5 major cities for each country in the array using Overpass API
 * @param countryCodes Array of country codes (e.g. ["FR", "DE"])
 * @returns Array of objects: { countryCode, cities: City[] }
 */
export const fetchCitiesByCountries = async (countryCodes: string[]) => {
    let results: City[] = [];
    for (const countryCode of countryCodes) {
        const query = `
        [out:json][timeout:25];
        area["ISO3166-1"="${countryCode}"]["admin_level"="2"]->.searchArea;
        (
          node["place"~"city|town"](area.searchArea);
        );
        out body;
      `;
        try {
            const response = await axios.post(OVERPASS_URL, query, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const cities = response.data.elements
                .map((el: any) => ({
                    id: el.id,
                    name: el.tags?.name,
                    lat: el.lat,
                    lon: el.lon,
                    type: el.tags?.place,
                    population: el.tags?.population ? parseInt(el.tags.population) : undefined,
                }))
                .filter((city: City) => city.name)
                .sort((a: any, b: any) => (b.population || 0) - (a.population || 0))
                .slice(0, 5) as City[]; // limit to 5 cities per country
            results = [...results, ...cities];
        } catch (error) {
            console.error(`Overpass API error for ${countryCode}:`, error);
        }
    }
    return results;
};
