import { AliveProvider } from "@/components/alive/alive-provider";
import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <AliveProvider>
      <SiteHeader />
      {children}
    </AliveProvider>
  );
}
