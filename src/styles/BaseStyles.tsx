import { useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useRecoilValue } from 'recoil';
import tw, { GlobalStyles } from 'twin.macro';

import { darkModeAtom } from 'src/state/atoms';

const CustomStyles = createGlobalStyle`
:root {
  --pal-brand-primary: #3e1bdb;
  --pal-brand-primary-hover: #241080;
  --pal-brand-primary-on: #ffffff;

  --pal-background-primary: #ffffff;
  --pal-background-secondary: #fafafa;
  --pal-background-tertiary: #f2f2f2;
  --pal-background-tooltip: #191b25;

  --pal-success: #20bf6b;
  --pal-success-background: #dbf5e7;
  --pal-success-border: #90dfb5;
  --pal-success-on: #ffffff;

  --pal-error: #eb3b5a;
  --pal-error-background: #fce0e5;
  --pal-error-border: #f59ead;
  --pal-error-on: #ffffff;

  --pal-warning: #f7b731;
  --pal-warning-background: #fef3de;
  --pal-warning-border: #fbdb99;
  --pal-warning-on: #ffffff;

  --pal-info: #5332e6;
  --pal-info-background: #e0dbf9;
  --pal-info-border: #9f8eed;
  --pal-info-on: #ffffff;

  --pal-text-primary: #000000;
  --pal-text-secondary: #333333;
  --pal-text-tertiary: #666666;
  --pal-text-link: #5332e6;
  --pal-text-link-hover: #241080;

  --pal-border-primary: #ebebeb;
  --pal-border-secondary: #e7e7e7;

  --pal-shadow-rbg: 0, 0, 0;

  --pal-example-details: #f2f2f2;
  --pal-example-code: #292d3e;
}

.dark {
  --pal-brand-primary: #5332e6;
  --pal-brand-primary-hover: #937eef;
  --pal-brand-primary-on: #ffffff;

  --pal-background-primary: #292d3e;
  --pal-background-secondary: #303448;
  --pal-background-tertiary: #222634;
  --pal-background-tooltip: #191b25;

  --pal-success: #26db7b;
  --pal-success-background: #284445;
  --pal-success-border: #257554;
  --pal-success-on: #ffffff;

  --pal-error: #ee5a74;
  --pal-error-background: #482f42;
  --pal-error-border: #89344c;
  --pal-error-on: #ffffff;

  --pal-warning: #f8c252;
  --pal-warning-background: #4a433c;
  --pal-warning-border: #8f7138;
  --pal-warning-on: #ffffff;

  --pal-info: #6260eb;
  --pal-info-background: #2c2a57;
  --pal-info-border: #33248c;
  --pal-info-on: #ffffff;

  --pal-text-primary: #ffffff;
  --pal-text-secondary: #d4d5d8;
  --pal-text-tertiary: #a9abb2;
  --pal-text-link: #6260eb;
  --pal-text-link-hover: #937eef;

  --pal-border-primary: #3a3e4d;
  --pal-border-secondary: #4b4f5d;

  --pal-shadow-rbg: 0, 0, 0;

  --pal-example-details: #303448;
  --pal-example-code: #222634;
}

body {
  ${tw`dark:(bg-background text-white)`}
}`;

const BaseStyles = () => {
  const isDarkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <>
      <CustomStyles />
      <GlobalStyles />
    </>
  );
};

export default BaseStyles;
