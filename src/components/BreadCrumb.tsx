export interface BreadcrumbProps {
  activeLink: string;
  prefixLink: { name: string; path: string }[];
  activeLinkColor?: string;
  prefixLinkColor?: string;
  marginTop?: number | string;
  marginLeft?: number | string;
  className?: string;
  textSize?: number;
  children?: any;
  spaceBetweenLinks?: number;
  activeLinkClassName?: string;
}

const Breadcrumb = ({
  activeLink,
  prefixLink,
  activeLinkColor = "#186FF5",
  prefixLinkColor = "#555",
  marginTop,
  marginLeft,
  className,
  textSize = 14,
  children,
  spaceBetweenLinks = 5,
  activeLinkClassName,
}: BreadcrumbProps) => {
  return (
    <>
      <p
        className={className}
        style={{
          fontSize: textSize,
          marginTop: marginTop,
          marginLeft: marginLeft,
        }}
      >
        {prefixLink.map((item, idx) => (
          <a
            href={item.path}
            key={"bread-crumb-item-" + idx.toString()}
            style={{
              textDecoration: "none",
              color: prefixLinkColor,
              marginLeft: idx === 0 ? 0 : spaceBetweenLinks,
            }}
          >
            <span className="all-color">{item.name}</span>
            <span
              className="all-color"
              style={{ color: prefixLinkColor, marginLeft: spaceBetweenLinks }}
            >
              {"/"}
            </span>
          </a>
        ))}
        <span
          className={activeLinkClassName}
          style={{ color: activeLinkColor, marginLeft: spaceBetweenLinks }}
        >
          {activeLink}
        </span>
        {children}
      </p>
    </>
  );
};

export default Breadcrumb;
