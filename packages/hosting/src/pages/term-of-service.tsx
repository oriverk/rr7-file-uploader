import { FC } from "react";
import { Container } from "@/components/ui/Container";
import { Markdown } from "@/components/ui/Markdown";
import { Seo } from "@/components/Seo";

import markdown from "../docs/term-of-service.md?raw";

const TermOfService: FC = () => (
  <Container>
    <Seo pathname="/terms" title="Term of Service" description="Term of Service" />
    <Markdown markdown={markdown} />
  </Container>
);

export default TermOfService;
