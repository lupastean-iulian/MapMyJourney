import { City, Country } from "@app/types"
import React, { useCallback, useMemo, useState } from "react"

export type ContextValue = {
    selectedCountries: Country[]
    selectedCities: City[]
    selectedCountryCodes: string[]
    setSelectedCountries: (countries: Country[]) => void
    setSelectedCities: (cities: City[]) => void
}

export const CreateItineraryContext = React.createContext<ContextValue | undefined>(undefined)

export const CreateItineraryContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const [selectedCountries, setCountries] = useState<Country[]>([])
    const [selectedCities, setCities] = useState<City[]>([])

    const setSelectedCountries = useCallback<ContextValue['setSelectedCountries']>(countries => {
        setCountries(countries)
    }, [])
    const setSelectedCities = useCallback<ContextValue['setSelectedCities']>(cities => {
        setCities(cities)
    }, [])
    const selectedCountryCodes = useMemo(() => {
        return selectedCountries.map(country => country.cca2)
    }, [selectedCountries])
    console.log("selectedCountries", selectedCountries)
    console.log("selectedCities", selectedCities)

    const value = useMemo<ContextValue>(() => ({
        selectedCountries,
        selectedCities,
        selectedCountryCodes,
        setSelectedCountries,
        setSelectedCities
    }), [selectedCountries, selectedCities, selectedCountryCodes, setSelectedCountries, setSelectedCities])
    return (
        <CreateItineraryContext.Provider value={value}>
            {children}
        </CreateItineraryContext.Provider>
    )
}