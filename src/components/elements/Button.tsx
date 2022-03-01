import { forwardRef, FunctionComponent } from 'react';

import tw, { styled } from 'twin.macro';

import Spinner from 'src/components/icons/Spinner';

type Color = 'primary' | 'danger';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type ButtonBaseProps = {
  size?: Size;
  color?: Color;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: () => JSX.Element;
};

type ButtonProps = ButtonBaseProps & React.ComponentPropsWithRef<'button'>;

const sizeStyles = Object.freeze({
  xs: tw`px-4 py-1 text-sm`,
  sm: tw`px-6 py-1 text-sm`,
  md: tw`px-6 py-2`,
  lg: tw`px-8 py-4`,
  xl: tw`px-10 py-4 text-lg`,
});

const ButtonBase = styled.button<ButtonBaseProps>((props) => [
  tw`flex justify-center items-center px-6 py-2 rounded-sm transition-all shadow`,
  tw`tracking-wide disabled:(cursor-not-allowed filter[grayscale(.5)]) `,
  props.size && sizeStyles[props.size],
]);

const ButtonPrimary = styled(ButtonBase)((props) => [
  tw`font-semibold text-white bg-primary not-disabled:hover:(bg-primary-hover)`,
  props.color === 'danger' && tw`bg-error not-disabled:hover:(bg-red-700)`,
]);

const Button: FunctionComponent<ButtonProps> = forwardRef((props, ref) => {
  const { isLoading, loadingText, disabled, leftIcon, ...restProps } = props;

  return (
    <ButtonPrimary ref={ref} disabled={disabled || isLoading} {...restProps}>
      {isLoading ? (
        <Spinner tw="text-lg mr-2" />
      ) : leftIcon ? (
        <span tw="svg:(mr-2)">{leftIcon()}</span>
      ) : null}

      <span tw="pointer-events-none">
        {isLoading && loadingText ? loadingText : props.children}
      </span>
    </ButtonPrimary>
  );
});

export default Button;
