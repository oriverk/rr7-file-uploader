import { FC } from "react";
import { Container } from "../components/Container";
import { Hero } from "../components/Hero";
import { HelpCenter } from "../components/HelpCenter";
import { OurTeam } from "../components/OurTeam";
import { Gallery } from "../components/Gallery";

const Home: FC = () => (
  <>
    <Container>
      <Hero />
    </Container>
    <Container>
      <Gallery />
    </Container>
    <Container>
      <OurTeam />
    </Container>
    <Container>
      <HelpCenter />
    </Container>
  </>
);

export default Home;
