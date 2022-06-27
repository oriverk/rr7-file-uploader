import { FC } from 'react'
import { Container } from '../components/Container'
import { Markdown } from '../components/Markdown'

import markdown from "../docs/privacy-policy.md?raw"

export const PrivacyPolicy: FC = () => (
  <Container>
    <Markdown markdown={markdown} />
  </Container>
)