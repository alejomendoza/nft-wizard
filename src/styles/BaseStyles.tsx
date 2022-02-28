import { useRecoilValue } from 'recoil';
import { GlobalStyles } from 'twin.macro';

import { darkModeAtom } from 'src/state/atoms';
import { useEffect } from 'react';

const BaseStyles = () => {
  const isDarkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <GlobalStyles />;
};

export default BaseStyles;
