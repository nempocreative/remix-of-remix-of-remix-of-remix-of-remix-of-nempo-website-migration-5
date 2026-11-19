import type { SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement>;

const glyphProps = (className?: string, style?: GlyphProps["style"]) => ({
  className,
  style,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true as const,
});

export const NavEventIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2.2" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 4v3M16 4v3M4.5 9.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="m12 12 .7 1.6 1.8.2-1.3 1.2.4 1.8-1.6-.9-1.6.9.4-1.8-1.3-1.2 1.8-.2L12 12Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

export const NavBeritaIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M5 4.5h10.5L19 8v11.5H5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M15.5 4.8V8H19M7 11h8M7 14h8M7 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7 7.8h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".62" />
  </svg>
);

export const NavCeritaIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M12 19.5c-2-1.4-4.1-1.8-7-1.2V5.8c2.8-.7 5.1-.2 7 1.2v12.5Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 19.5c2-1.4 4.1-1.8 7-1.2V5.8c-2.8-.7-5.1-.2-7 1.2v12.5Z" fill="currentColor" opacity=".22" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 7v12.5M7.5 9h2M14.5 9h2M7.5 12h2M14.5 12h2" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity=".72" />
  </svg>
);

export const NavKomunitasIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <circle cx="12" cy="12" r="8.5" fill="currentColor" opacity=".11" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3.8 12h16.4M12 3.5c2 2.3 3 5.1 3 8.5s-1 6.2-3 8.5c-2-2.3-3-5.1-3-8.5s1-6.2 3-8.5Z" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    <path d="M5.2 7.2h13.6M5.2 16.8h13.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity=".58" />
  </svg>
);

export const NavMerchandiseIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="m8 5 2-2h4l2 2 4 2.5-2 4-2-1v9H8v-9l-2 1-2-4L8 5Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 3c0 2 4 2 4 0M16 8.5l-1.5-1.2M8 8.5l1.5-1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NavDigiIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <rect x="3.5" y="5" width="17" height="12" rx="2" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 20h8M12 17v3M12 8.5v4M12 8.5l-2 2M12 8.5l2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NavKerjaSamaIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 19.5V7.5l4-3 4 3v12M12 19.5V5.5l4-2 4 2v14" fill="currentColor" opacity=".11" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M7 10h2M7 13h2M15 9h2M15 12h2M3 19.5h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NavTalentIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <circle cx="12" cy="8" r="3.5" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 20c.5-3.7 2.9-5.7 7-5.7s6.5 2 7 5.7" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="m18.3 4.2.4 1 .9.4-.9.4-.4 1-.4-1-.9-.4.9-.4.4-1Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const NavHomeIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="m4 10.5 8-6.5 8 6.5v8.2a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 18.7v-8.2Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.5 20v-5.5h5V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

export const NavTicketIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 7.2A2.2 2.2 0 0 0 6.2 9.4 2.2 2.2 0 0 0 8.4 7.2h7.2a2.2 2.2 0 0 0 2.2 2.2A2.2 2.2 0 0 0 20 7.2V17a2.2 2.2 0 0 0-2.2-2.2 2.2 2.2 0 0 0-2.2 2.2H8.4a2.2 2.2 0 0 0-2.2-2.2A2.2 2.2 0 0 0 4 17V7.2Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 7.5v1.3M12 10.7V12M12 13.7V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NavRecruitmentIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <circle cx="10" cy="8" r="3.3" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 20c.5-3.4 2.6-5.2 6-5.2s5.5 1.8 6 5.2" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18.2 8.2v5M15.7 10.7h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const NavPortfolioIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 8.6A2 2 0 0 1 6 6.6h3.4l1.6 2.1H18a2 2 0 0 1 2 2v6.7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.6Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 11.6h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".55" />
    <path d="M9.6 15.4h4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".55" />
  </svg>
);

export const NavContactIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4.4 6.6A2.2 2.2 0 0 1 6.6 4.4h10.8a2.2 2.2 0 0 1 2.2 2.2v7.4a2.2 2.2 0 0 1-2.2 2.2h-6L7 20.2v-3.9a2.2 2.2 0 0 1-2.6-2.1V6.6Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8.6 8.8h6.8M8.6 11.8h4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
  </svg>
);

