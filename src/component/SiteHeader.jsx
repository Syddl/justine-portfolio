import Link from "next/link";
import Logo from "@/component/Logo";
import ThemeToggle from "@/component/ThemeToggle";

// Sticky header in the content column. Transparent over the top of the page;
// once the page scrolls, .site-header (globals.css) fades in a blurred
// surface and a hairline. Server component: only the toggle ships JS.
const SiteHeader = () => {
  return (
    <header className="site-header sticky top-0 z-30">
      <div className="mx-auto flex h-16 w-full max-w-col items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-4 text-[15px] text-muted sm:gap-6">
          <Link href="/projects" className="transition-colors hover:text-ink">
            Projects
          </Link>
          <Link href="/contact" className="transition-colors hover:text-ink">
            Contact
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
