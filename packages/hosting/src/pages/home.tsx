import { FC } from "react";
import { Container } from "../components/Container";
import { Hero } from "../components/Hero";
import { HelpCenter } from "../components/HelpCenter";
import { OneTeam } from "../components/OneTeam";
import { Gallery } from "../components/Gallery";

export const Home: FC = () => (
  <>
    <Container>
      <Hero />
    </Container>
    <Container>
      <Gallery />
    </Container>
    <Container>
      <OneTeam />
    </Container>
    <Container>
      <HelpCenter />
    </Container>
  </>
);