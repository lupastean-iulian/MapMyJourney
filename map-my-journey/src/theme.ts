import { createTheme } from '@mui/material/styles';

// Extend the Palette to include navbar color
declare module '@mui/material/styles' {
    interface Palette {
        navbar: Palette['primary'];
    }
    interface PaletteOptions {
        navbar?: PaletteOptions['primary'];
    }
}

const theme = createTheme({
    palette: {
        navbar: {
            main: '#2d3847',
            contrastText: '#fff',
        },
    },
});

export default theme;
