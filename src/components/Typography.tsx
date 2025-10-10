import * as React from 'react';
import { clsxm } from '@/lib/clsxm';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'label'
  | 'blockquote'
  | 'small'
  | 'strong';

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  variant?: TypographyVariant;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const Typography = <T extends React.ElementType = 'p'>({
  as,
  variant,
  children,
  className,
  ...rest
}: TypographyProps<T>) => {
  const Component = as || variant || 'p';

  const baseStyle = 'text-gray-800 dark:text-gray-100'; 

  const variantStyles: Record<TypographyVariant, string> = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-bold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
    p: 'text-base',
    span: 'text-base',
    label: 'text-sm font-medium',
    blockquote: 'text-lg italic border-l-4 border-gray-300 pl-4',
    small: 'text-sm',
    strong: 'font-bold',
  };

  const styles = clsxm(baseStyle, variant && variantStyles[variant], className);

  return (
    <Component className={styles} {...rest}>
      {children}
    </Component>
  );
};

export default Typography;
