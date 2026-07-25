import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Footer from "./components/Footer";
import EarthGlobe from "./components/EarthGlobeLazy";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <EarthGlobe />
      </main>
      <Footer />
    </>
  );
}
