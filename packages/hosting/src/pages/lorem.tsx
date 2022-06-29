import { FC } from "react";
import { Container } from "../components/Container";
import { Markdown } from "../components/Markdown";

import markdown from "../docs/lorem.md?raw";

const Lorem: FC = () => (
  <Container>
    <Markdown markdown={markdown} />
  </Container>
);

export default Lorem;