import {createGlobalStyle} from 'styled-components'

export const GlobalStyles = createGlobalStyle`

body{
    margin:0;
    padding:0;

    --primary:${({theme}) => theme.primary};

    --light-color:${({theme}) => theme.lightColor};
     
    --base-color:${({theme}) => theme.base};
    --light-shade:${({theme}) => theme.light};
    --accent-light:${({theme}) => theme.accent};
    --accent-dark:${({theme}) => theme.accentDark};

     --font-primary:${({theme}) => theme.fontP};
     --font-secondary:${({theme}) => theme.fontS};

     --card-shadow:${({theme}) => theme.cardShadow};
     --button-shadow:${({theme}) => theme.buttonShadow};

     --skeleton-color:${({theme}) => theme.skeletonColor};
    --secondary:${({theme}) => theme.base};
}

`
