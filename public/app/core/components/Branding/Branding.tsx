import { css, cx } from '@emotion/css';
import React, { FC } from 'react';

import { colorManipulator } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo }) => {
  return <img className={className} src={`${logo ? logo : 'public/img/indip_icon.svg'}`} alt="Grafana" />;
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const theme = useTheme2();

  const background = css({
    '&:before': {
      content: '""',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      background: `url(public/img/g8_login_${theme.isDark ? 'dark' : 'light'}.svg)`,
      backgroundPosition: 'top center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',

      opacity: 0,
      transition: 'opacity 3s ease-in-out',

      [theme.breakpoints.up('md')]: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      },
    },
  });

  return <div className={cx(background, className)}>{children}</div>;
};

const MenuLogo: FC<BrandComponentProps> = ({ className }) => {
  return <img className={className} src="public/img/indip_icon.svg" alt="Grafana" />;
};

const LoginBoxBackground = () => {
  const theme = useTheme2();
  return css({
    background: colorManipulator.alpha(theme.colors.background.primary, 0.7),
    backgroundSize: 'cover',
  });
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static LoginBoxBackground = LoginBoxBackground;
  static AppTitle = 'indip Dashboard';
  static LoginTitle = 'Welcome to indip';
  static HideEdition = false;
  static GetLoginSubTitle = (): null | string => {
    return null;
  };
}
