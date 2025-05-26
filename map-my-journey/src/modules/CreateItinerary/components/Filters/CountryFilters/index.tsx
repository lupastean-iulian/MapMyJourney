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
                p: { xs: '16px 12px', sm: '20px 16px' },

                borderRadius: 3,
                boxShadow: 3,
                bgcolor: 'background.paper',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
            }}
        >
            <Box mb={{ xs: 2.5, sm: 3 }} >
                <Typography variant='h6' sx={{
                    fontSize: {
                        xs: '16px', // Smaller on extra small screens
                        sm: '20px',
                    },
                }}>
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
                        placeholder="Select one or more countries"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            sx: {
                                fontSize: {
                                    xs: '14px',
                                    sm: '16px',
                                },
                                height: {
                                    xs: '44px',
                                    sm: '48px',
                                },
                            },
                            endAdornment: (
                                <>
                                    {!allCountries ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: {
                                    xs: '14px',
                                    sm: '16px',
                                },
                            },
                        }}
                    />
                )}
                sx={{ width: '100%' }}
            />
        </Paper>
    );
};