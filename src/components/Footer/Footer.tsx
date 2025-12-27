import { NC_SITE_SETTINGS } from "@/contains/site-settings";
import MyImage from "../MyImage";
import Link from "next/link";

interface Page {
  title: string | null;
  uri: string | null;
  databaseId: number;
}

interface Props {
  pages?: Page[] | null;
}

export default function Footer({ pages }: Props) {
  const currentYear = new Date().getFullYear();
  const siteTitle = NC_SITE_SETTINGS.site_info.site_title || "Your Site";
  const siteDescription = NC_SITE_SETTINGS.site_info.site_description || "";

  const copyrightText = NC_SITE_SETTINGS.site_footer.all_rights_reserved_text
    .replace("{year}", currentYear.toString())
    .replace("{company_name}", siteTitle);

  // Filter out pages without title or uri, and remove duplicates by URI
  const validPages = (pages || [])
    .filter((page): page is Page => !!(page.title && page.uri))
    .filter((page, index, self) => 
      index === self.findIndex((p) => p.uri === page.uri)
    );

  // Distribute pages across 3 columns
  const itemsPerColumn = Math.ceil(validPages.length / 3);
  const getPageColumn = (index: number) => {
    const startIndex = index * itemsPerColumn;
    const columnPages = validPages.slice(startIndex, startIndex + itemsPerColumn);
    
    return {
      title: index === 0 ? "Pages" : index === 1 ? "" : "",
      links: columnPages.map(page => ({
        label: page.title || "",
        uri: page.uri || null,
      })),
    };
  };

  // Get up to 3 page columns (excluding company info column)
  const pageColumns: Array<{ title: string; links: Array<{ label: string; uri: string | null }> }> = [];
  const maxColumns = Math.min(3, Math.max(1, Math.ceil(validPages.length / itemsPerColumn)));
  for (let i = 0; i < maxColumns; i++) {
    const column = getPageColumn(i);
    if (column.links.length > 0) {
      pageColumns.push(column);
    }
  }

  const FooterSection = ({ title, links }: { title: string; links: Array<{ label: string; uri: string | null }> }) => (
    <div>
      <h3 className="text-sm font-semibold leading-6 text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <ul role="list" className="mt-6 space-y-4">
        {links.map((link, index) => (
          <li key={link.uri || index}>
            <Link
              href={link.uri || "#"}
              className="text-sm leading-6 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer
      className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-6 pt-12 pb-0 sm:pt-16 sm:pb-0 lg:px-8 lg:pt-20 lg:pb-0">
        {/* Main Footer Content - 4 Columns */}
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          {/* Column 1: Company Info */}
          <div className="space-y-8">
            <div>
              <Link href="/" className="flex items-center">
                <MyImage
                  src={NC_SITE_SETTINGS.site_info.site_logo || "/logo.png"}
                  alt={siteTitle}
                  width={120}
                  height={40}
                  className="h-8 w-auto dark:brightness-0 dark:invert"
                />
              </Link>
            </div>
            {siteDescription && (
              <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {siteDescription}
              </p>
            )}
            
            {/* Social Media Links */}
            {NC_SITE_SETTINGS.site_socials.length > 0 && (
              <div className="flex space-x-6">
                {NC_SITE_SETTINGS.site_socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                    aria-label={social.name}
                  >
                    <span className="sr-only">{social.name}</span>
                    <MyImage
                      src={social.icon}
                      alt={`${social.name} icon`}
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2-4: WordPress Pages */}
          {pageColumns.length > 0 ? (
            pageColumns.map((column, index) => (
              <FooterSection 
                key={index}
                title={column.title || (index === 0 ? "Pages" : "")} 
                links={column.links}
              />
            ))
          ) : (
            // Fallback if no pages
            <>
              <FooterSection 
                title="Pages" 
                links={[]}
              />
              <FooterSection 
                title="" 
                links={[]}
              />
              <FooterSection 
                title="" 
                links={[]}
              />
            </>
          )}
        </div>

        {/* Bottom Bar: Copyright + Additional Links */}
        <div className="mt-2 pt-8 mb-0 pb-0 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            {/* Copyright */}
            <p className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
              {copyrightText}
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}
