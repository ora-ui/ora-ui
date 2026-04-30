import { ComponentProps } from 'react';
import { Logo } from '../assets/Logo';
import clsx from 'clsx';
import Link from 'next/link';

export const AppHeader = (props: ComponentProps<'header'>) => {
  return (
    <header
      className={clsx(
        props.className,
        'absolute left-0 top-0 flex justify-between h-(--header-height) items-center w-full pl-8'
      )}
      {...props}
    >
      <Link href="/">
        <Logo />
      </Link>
    </header>
  );
};
