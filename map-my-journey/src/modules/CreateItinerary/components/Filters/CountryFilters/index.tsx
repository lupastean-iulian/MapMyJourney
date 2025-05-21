import { useWorldCountries } from "@app/hooks/useWorldCountries";
import React, { useState } from "react";
import { Autocomplete, Box, CircularProgress, TextField, Typography } from "@mui/material";
import { CountryOption } from "../../CountryAutocompleteOption";
import { useCreateItineraryContext } from "@app/modules/CreateItinerary/context/useCreateItineraryContext";
import { Country } from "@app/types";

export const CountryFilters: React.FC = () => {
    const { getAllCountries, getCountryByName } = useWorldCountries();
    const countries = getAllCountries();
    const { selectedCountries, setSelectedCountries } = useCreateItineraryContext();
    const handleChange = (_: any, value: Country[]) => {
        setSelectedCountries(value);
    };

    return (
        <Box>
            <Typography variant="h3">Country Filters</Typography>
            <Autocomplete
                multiple
                options={countries}
                value={selectedCountries}
                onChange={handleChange}
                getOptionLabel={(option) => option.name.common}
                renderOption={(props, option) => (
                    <li {...props}>
                        <CountryOption name={option.name.common} flag={option.flag || ''} />
                    </li>
                )}
                renderValue={(value) =>
                    value.map((option) => {
                        return (
                            <CountryOption name={option.name.common} flag={option.flag || ''} />
                        );
                    })}
                loading={!countries}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Cities"
                        placeholder="Start typing a city name..."
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {!countries ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                    />
                )}
                sx={{ width: 300 }}
            />
        </Box>
    );
};