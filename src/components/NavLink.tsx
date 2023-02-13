import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from "react";

export interface NavLinkProps
  extends Omit<
    React.PropsWithChildren<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >
    >,
    "className"
  > {
  href: string;
  exact?: boolean;
  className?: string | ((props: { isActive: boolean }) => string | undefined);
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  exact,
  children,
  className,
  ...props
}) => {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href}>
      <a
        className={
          typeof className !== "undefined"
            ? typeof className === "string"
              ? className
              : className({ isActive })
            : ""
        }
        {...props}
      >
        {children}
      </a>
    </Link>
  );
};

export default NavLink;
