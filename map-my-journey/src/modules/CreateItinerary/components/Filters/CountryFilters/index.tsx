import { useWorldCountries } from "@app/hooks/useWorldCountries";
import React, { useState } from "react";
import { Autocomplete, Box, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { CountryOption } from "../../CountryAutocompleteOption";
import { useCreateItineraryContext } from "@app/modules/CreateItinerary/context/useCreateItineraryContext";
import { Country } from "@app/types";

export const CountryFilters: React.FC = () => {
    const { allCountries, selectedCountries, setSelectedCountries } = useCreateItineraryContext();
    const handleChange = (_: any, value: Country[]) => {
        setSelectedCountries(value);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: 'background.paper',
                width: { xs: '100%', sm: 500 },
                maxWidth: '100%',
                mb: 2,
                ml: { xs: 0, sm: 3 },
            }}
        >
            <Box mb={2}>
                <Typography component="h2" sx={{ fontWeight: 600, fontSize: 20, mb: 1 }}>
                    Country Filters
                </Typography>
            </Box>
            <Autocomplete
                multiple
                options={allCountries}
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
                loading={!allCountries}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Countries"
                        placeholder="Start typing a country name..."
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {!allCountries ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                    />
                )}
                sx={{ width: '100%' }}
            />
        </Paper>
    );
};