import { FC } from "react";
import { Container } from "@/components/ui/Container";
import { Seo } from "@/components/Seo";

export const PageNotFound: FC = () => (
  <Container>
    <Seo noindex />
    <div className="min-h-96 relative flex flex-1 shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg bg-gray-100 py-16 shadow-lg md:py-20 xl:py-48">
      <h1 className="text-7xl">404</h1>
      <p className="text-4xl">Page Not Found</p>
    </div>
  </Container>
);
