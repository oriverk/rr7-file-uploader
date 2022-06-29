import { FC } from "react";
import { Container } from "../components/Container";
import { Markdown } from "../components/Markdown";
import { Seo } from "../components/Seo";

import markdown from "../docs/lorem.md?raw";

const Lorem: FC = () => (
  <Container>
    <Seo pathname="/blog/lorem" title="Lorem Ipsum" description="Maior cognataque pronos tantummodo effluat" />
    <Markdown markdown={markdown} />
  </Container>
);

export default Lorem;