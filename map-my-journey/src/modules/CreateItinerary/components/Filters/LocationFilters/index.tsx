import { Box } from "@mui/material"
import { CityFilters } from "../CityFilters"
import { CountryFilters } from "../CountryFilters"

export const LocationFilters: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'flex-start',
                gap: 2,
                width: '100%',
                p: { xs: 0, md: 2 },
            }}
        >
            <CountryFilters />
            <CityFilters />
        </Box>
    )
}