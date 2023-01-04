import { FC } from "react";
import { Container } from "@/components/ui/Container";
import { Markdown } from "@/components/ui/Markdown";
import { Seo } from "@/components/Seo";

import markdown from "../docs/privacy-policy.md?raw";

const PrivacyPolicy: FC = () => (
  <Container>
    <Seo pathname="/privacy" title="Privacy Policy" description="Privacy Policy" />
    <Markdown markdown={markdown} />
  </Container>
);

export default PrivacyPolicy;
