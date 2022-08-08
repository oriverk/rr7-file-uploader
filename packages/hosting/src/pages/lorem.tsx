import { FC } from "react";
import { Container } from "@/components/Container";
import { Markdown } from "@/components/Markdown";
import { Seo } from "@/components/Seo";

import markdown from "../docs/lorem.md?raw";

const TermOfService: FC = () => (
  <Container>
    <Seo
      pathname="/lorem"
      title="lorem ipsum"
      description="In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."
    />
    <Markdown markdown={markdown} />
  </Container>
);

export default TermOfService;