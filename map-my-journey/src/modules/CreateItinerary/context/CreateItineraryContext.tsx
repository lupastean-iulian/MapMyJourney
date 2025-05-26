import { useWorldCountries } from "@app/hooks/useWorldCountries"
import { City, Country } from "@app/types"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { PlaceDetails } from "../components/Map/types"

export type ContextValue = {
    selectedCountries: Country[]
    selectedCities: City[]
    selectedCountryCodes: string[]
    allCountries: Country[]
    mapInstance: google.maps.Map | null
    markersCache: Map<string, { place: PlaceDetails, marker: google.maps.marker.AdvancedMarkerElement }>
    setSelectedCountries: (countries: Country[]) => void
    setSelectedCities: (cities: City[]) => void
    setMapInstance: (map: google.maps.Map) => void
}

export const CreateItineraryContext = React.createContext<ContextValue | undefined>(undefined)

export const CreateItineraryContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const [selectedCountries, setCountries] = useState<Country[]>([])
    const [selectedCities, setCities] = useState<City[]>([])
    const [mapInstance, setMap] = useState<google.maps.Map | null>(null)
    const { getAllCountries } = useWorldCountries()
    const countries = getAllCountries();
    const setSelectedCountries = useCallback<ContextValue['setSelectedCountries']>(countries => {
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
        selectedCountries,
        selectedCities,
        selectedCountryCodes,
        allCountries: countries,
        mapInstance,
        markersCache: markersCache.current,
        setMapInstance,
        setSelectedCountries,
        setSelectedCities
    }), [selectedCountries, selectedCities, selectedCountryCodes, countries, mapInstance, setMapInstance, setSelectedCountries, setSelectedCities])
    return (
        <CreateItineraryContext.Provider value={value}>
            {children}
        </CreateItineraryContext.Provider>
    )
}