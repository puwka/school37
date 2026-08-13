"use client";

import { usePathname } from "next/navigation";
import { SiteHeader, type NavItem } from "@/components/layout/site-header";
import { UtilityBar } from "@/components/layout/utility-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import type { SchoolSettings } from "@/server/queries";

export function SiteShell({
  children,
  school,
  nav,
  footerOfficial,
  footerMore,
}: {
  children: React.ReactNode;
  school: SchoolSettings;
  nav: NavItem[];
  footerOfficial: { label: string; href: string }[];
  footerMore: { label: string; href: string }[];
}) {
  const pathname = usePathname() || "/";
  const currentPath = pathname.endsWith("/") ? pathname : `${pathname}/`;

  return (
    <>
      <UtilityBar
        street={school.address.street}
        city={school.address.city}
        phone={school.phone}
        phoneTel={school.phoneTel}
        email={school.email}
        workHoursShort={school.workHoursShort}
      />
      <SiteHeader
        title={school.brandName}
        items={nav}
        currentPath={currentPath}
        showSearch={true}
        onVisuallyImpaired={() => {
          document.documentElement.classList.toggle("visually-impaired");
        }}
      />
      <div id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter
        school={school}
        official={footerOfficial}
        more={footerMore}
      />
    </>
  );
}
