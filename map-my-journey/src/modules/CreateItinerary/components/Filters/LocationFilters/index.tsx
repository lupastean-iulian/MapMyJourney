import { Box } from "@mui/material"
import { CityFilters } from "../CityFilters"
import { CountryFilters } from "../CountryFilters"

export const LocationFilters: React.FC = () => {
    return (
        <Box display="flex" justifyContent="space-around" width="100%" padding="0 30px">
            <CountryFilters />
            <CityFilters />
        </Box>
    )
}