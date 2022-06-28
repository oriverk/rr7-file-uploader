import { FC } from 'react'
import { Container } from '../components/Container'
import { Markdown } from '../components/Markdown'

import markdown from "../docs/term-of-service.md?raw"

const TermOfService: FC = () => (
  <Container>
    <Markdown markdown={markdown} />
  </Container>
)

export default TermOfService