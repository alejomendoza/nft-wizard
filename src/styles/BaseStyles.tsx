import { useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useRecoilValue } from 'recoil';
import tw, { GlobalStyles } from 'twin.macro';

import { darkModeAtom } from 'src/state/atoms';

const CustomStyles = createGlobalStyle({
  body: tw`dark:(bg-background text-white)`,
});

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
