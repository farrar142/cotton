import { LinkProps as MLinkProps, Link as MLink, styled } from '@mui/material';
import Link, { LinkProps } from 'next/link';
import { formatUrl } from 'next/dist/shared/lib/router/utils/format-url';
import { forwardRef, useMemo } from 'react';

const CustomLink = styled(MLink)<{ $?: boolean }>(({ $, theme }) => [
  {
    // display: 'inline-flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // position: 'relative',
    // boxSizing: 'border-box',
    // outline: 0,
    // border: 0,
    // userSelect: 'none',
    verticalAlign: 'center',
    textDecoration: 'none',
  },
  $
    ? {
        ':hover': {
          textDecoration: 'underline',
          textDecorationColor: theme.palette.text.primary,
        },
      }
    : {},
]);

const NextLink = forwardRef(
  (
    {
      children,
      $ = false,
      ...props
    }: Omit<MLinkProps, 'href'> & Pick<LinkProps, 'href'> & { $?: boolean },
    ref
  ): JSX.Element => {
    const href = useMemo(() => {
      const href = props.href;
      if (href === undefined) return '/';
      if (typeof href === 'string') return href;
      return formatUrl(href);
    }, [props.href]);

    return (
      <CustomLink component={Link} {...props} href={href} $={$}>
        {children}
      </CustomLink>
    );
  }
);

export default NextLink;
