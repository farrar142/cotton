import { LinkProps as MLinkProps, Link as MLink, styled } from '@mui/material';
import Link, { LinkProps } from 'next/link';
import { formatUrl } from 'next/dist/shared/lib/router/utils/format-url';
import { forwardRef, useMemo, useRef } from 'react';

const CustomLink = styled(MLink)<{ withunderline?: 'false' | 'true' }>(
  ({ withunderline, theme }) => [
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
    withunderline !== 'false'
      ? {
          ':hover': {
            textDecoration: 'underline',
            textDecorationColor: theme.palette.text.primary,
          },
        }
      : {},
  ]
);

const NextLink = forwardRef(
  (
    {
      children,
      withunderline = false,
      onClick = (e) => {},
      disabled,
      ...props
    }: Omit<MLinkProps, 'href'> &
      Pick<LinkProps, 'href'> & { withunderline?: boolean; disabled?: boolean },
    ref
  ): JSX.Element => {
    const href = useMemo(() => {
      const href = props.href;
      if (href === undefined) return '/';
      if (typeof href === 'string') return href;
      return formatUrl(href);
    }, [props.href]);
    const haveToMove = useRef(true);
    const lastMousePos = useRef({ x: 0, y: 0 });

    if (disabled) {
      return <>{children}</>;
    }

    return (
      <CustomLink
        component={Link}
        {...props}
        href={href}
        withunderline={`${withunderline}`}
        onClick={(e) => {
          if (!haveToMove.current) {
            e.preventDefault(), e.stopPropagation();
          }
          onClick(e);
        }}
        onMouseDown={(e) => {
          haveToMove.current = true;
          lastMousePos.current = { x: e.clientX, y: e.clientY };
          props.onMouseDown && props.onMouseDown(e);
        }}
        onMouseUp={(e) => {
          const { clientX, clientY } = e;
          const xPow = Math.pow(clientX - lastMousePos.current.x, 2);
          const yPow = Math.pow(clientY - lastMousePos.current.y, 2);
          if (10 < Math.sqrt(xPow + yPow)) {
            haveToMove.current = false;
          } else {
            haveToMove.current = true;
          }
          props.onMouseUp && props.onMouseUp(e);
        }}
        onMouseLeave={(e) => {
          haveToMove.current = true;
          props.onMouseLeave && props.onMouseLeave(e);
        }}
      >
        {children}
      </CustomLink>
    );
  }
);

export default NextLink;
