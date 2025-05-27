import { useWorldCountries } from "@app/hooks/useWorldCountries"
import { City, Country } from "@app/types"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { PlaceDetails } from "../components/Map/types"

export type ContextValue = {
    selectedLocations: PlaceDetails[]
    selectedCountries: Country[]
    selectedCities: City[]
    selectedCountryCodes: string[]
    allCountries: Country[]
    mapInstance: google.maps.Map | null
    markersCache: Map<string, { place: PlaceDetails, marker: google.maps.marker.AdvancedMarkerElement }>
    setSelectedLocations: (locations: PlaceDetails[]) => void
    setSelectedCountries: (countries: Country[]) => void
    setSelectedCities: (cities: City[]) => void
    setMapInstance: (map: google.maps.Map) => void
}

export const CreateItineraryContext = React.createContext<ContextValue | undefined>(undefined)

export const CreateItineraryContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const { getAllCountries } = useWorldCountries()

    const [selectedLocations, setLocations] = useState<PlaceDetails[]>([])
    const [selectedCountries, setCountries] = useState<Country[]>([])
    const [selectedCities, setCities] = useState<City[]>([])
    const [mapInstance, setMap] = useState<google.maps.Map | null>(null)
    const countries = getAllCountries();

    const setSelectedLocations = useCallback<ContextValue['setSelectedLocations']>(locations => {
        console.log('Setting selected locations:', locations)
        setLocations(locations)
    }, [])
    const setSelectedCountries = useCallback<ContextValue['setSelectedCountries']>(countries => {
        console.log('Setting selected countries:', countries)
        setCountries(countries)
    }, [])
    const setSelectedCities = useCallback<ContextValue['setSelectedCities']>(cities => {
        setCities(cities)
    }, [])
    const setMapInstance = useCallback<ContextValue['setMapInstance']>(map => {
        setMap(map)
    }, [])

    const selectedCountryCodes = useMemo(() => {
        return selectedCountries.map(country => country.cca2)
    }, [selectedCountries])
    const markersCache = useRef<Map<string, { place: PlaceDetails, marker: google.maps.marker.AdvancedMarkerElement }>>(new Map());

    const value = useMemo<ContextValue>(() => ({
        selectedLocations,
        selectedCountries,
        selectedCities,
        selectedCountryCodes,
        allCountries: countries,
        mapInstance,
        markersCache: markersCache.current,
        setSelectedLocations,
        setMapInstance,
        setSelectedCountries,
        setSelectedCities
    }), [selectedLocations, selectedCountries, selectedCities, selectedCountryCodes, countries, mapInstance, setSelectedLocations, setMapInstance, setSelectedCountries, setSelectedCities])
    return (
        <CreateItineraryContext.Provider value={value}>
            {children}
        </CreateItineraryContext.Provider>
    )
}