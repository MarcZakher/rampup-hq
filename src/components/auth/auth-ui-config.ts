import { ThemeSupa } from '@supabase/auth-ui-shared';

export const authUiConfig = {
  theme: ThemeSupa,
  variables: {
    default: {
      colors: {
        brand: '#9b87f5',
        brandAccent: '#7E69AB',
        brandButtonText: 'white',
        defaultButtonBackground: '#F8F9FA',
        defaultButtonBackgroundHover: '#E9ECEF',
        inputBackground: 'white',
        inputBorder: '#E9ECEF',
        inputBorderHover: '#9b87f5',
        inputBorderFocus: '#7E69AB',
      },
      borderWidths: {
        buttonBorderWidth: '1px',
        inputBorderWidth: '1px',
      },
      radii: {
        borderRadiusButton: '0.5rem',
        buttonBorderRadius: '0.5rem',
        inputBorderRadius: '0.5rem',
      },
    },
  },
  style: {
    button: {
      border: '1px solid transparent',
      borderRadius: '0.5rem',
      padding: '0.625rem 1.25rem',
      transition: 'all 0.2s ease-in-out',
    },
    anchor: {
      color: '#7E69AB',
      textDecoration: 'none',
      fontWeight: '500',
    },
    container: {
      borderRadius: '0.75rem',
    },
    input: {
      borderRadius: '0.5rem',
    },
  },
};