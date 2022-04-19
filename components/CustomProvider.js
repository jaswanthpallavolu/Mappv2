import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from '../styles/global'
import { darkTheme, lightTheme } from '../styles/theme'
import { useSelector } from 'react-redux'
export function CustomProvider({ children }) {
    const theme = useSelector(state => state.theme.value)
    return (
        <>
            <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
                <GlobalStyles />
                {children}
            </ThemeProvider>
        </>
    )
}
