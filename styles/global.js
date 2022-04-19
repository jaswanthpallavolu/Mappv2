import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`

body{
    margin:0;
    padding:0;
    --primary:${({ theme }) => theme.color1};
    --secondary:${({ theme }) => theme.color2};
    --third:${({ theme }) => theme.color3};

     --font-primary:${({ theme }) => theme.fontP};
     --font-secondary:${({ theme }) => theme.fontS};

     font-family:'Open sans',sans-serif;

     --card-shadow:${({ theme }) => theme.cardShadow};
     --button-shadow:${({ theme }) => theme.buttonShadow};
}
`
