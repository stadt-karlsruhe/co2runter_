import React from "react";
import {
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Header from "../Header/Header";
import HeroSection from "./HeroSection";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import "../../css/components/Landingpage/landingpage.css";
import CheckAuth from "../CheckAuth";

import { resetItems, setLoading } from '../../features/Store';
import { useDispatch } from 'react-redux';


const Landingpage = () => {
  const navigate = useNavigate();
  const isLoggedIn = CheckAuth();

  // reset the store
  const dispatch = useDispatch();
  dispatch(resetItems())
  

  const handleCO2 = () => {
    navigate("/CO2Rechner");
  };

  const handleDashboard = () => {
    navigate("/Dashboard");
  };

  const handleNewGroup = () => {
    if(isLoggedIn){
      navigate("/NewGroup/loggedIn");
    }else{
      navigate("/NewGroup/loggedOut");
    }
  };

  return (
    <div className="App">
      <Header />
      <HeroSection />
      <div className="accordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">
              Wie funktioniert der CO2 Rechner?
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="accordionDetail">
            <Typography>
              Laut Energiebilanz Karlsruhe 2020 liegt der CO2 Ausstoß bei 7,4t
              jährlich pro Kopf. Die Effekte durch privaten Konsum sind dabei
              nicht enthalten. Addiert man hier den Grundwert (2,9t) gemäß
              unserer Vereinfachung des UBA-Modells, dann erhält man 10,3t CO2.
              Diese Grundwert-Summe bildet sich aus 4 "Sektoren", die wir durch
              unseren Lebensstil beeinflussen können, plus einer festen Zugabe für
              öffentliche Infrastruktur. Im CO2-Rechner können individuelle Angaben
              für die Sektoren Wohnen (Heizung und Strom), 
              Mobilität, Ernährung und allgemeiner Konsum gemacht werden.
              Die Auswahlmöglichkeiten und Berechnungsmodelle 
              sind an den CO2-Rechner des Umweltbundesamts
              angelehnt. So lassen sich die Effekte zeigen, die wir durch einen sparsamen
              oder weniger sparsamen Lebensstil erzielen können. Eine exaktere
              Berechnung ist ohne weitere Informationen über die persönliche
              Situation im Einzelfall nicht möglich. Weitere Informationen zum
              UBA-Modell und den Einsparpotentialen finden sich in dieser  
              
              <Link
                className="text-link"
                href="https://www.umweltbundesamt.de/publikationen/klimaneutral-leben"
                target="_blank"
              >
              &nbsp; Publikation &nbsp;
              </Link>
               des UBA.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography variant="h6">
              Wo kann ich die Ergebnisse vom CO2 Rechner sehen?
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="accordionDetail">
            <Typography>
              Persönliche Maßnahmen für den Klimaschutz werden
              erfolgreicher, wenn wir auch andere Menschen von ihnen überzeugen.
              Geben Sie Ihren Stadtteil an und die Anzahl der Personen, die Sie
              dort als Mitstreiterinnen und Mitstreiter gewinnen können und nehmen Sie so an
              der Klima-Challenge teil. Die aktuellen Ergebnisse sind auf
              unserem{" "}
              <Link className="text-link" href="/Dashboard" target="_blank">
                CO2-Dashboard
              </Link>{" "}
              sichtbar. Im Kanal "Grüne Stadt" der{" "}
              <Link
                className="text-link"
                href="https://www.karlsruhe.de/stadt-rathaus/so-ist-karlsruhe/digital-smart/karlsruheapp"
                target="_blank"
              >
                Karlsruhe-App
              </Link>{" "}
              wird das Umweltamt das Projekt weiter verfolgen.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography variant="h6">
              Wie funktioniert das Gruppensystem?
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="accordionDetail">
            <Typography>
            Über das Gruppensystem auf dieser Webseite können Sie gemeinsam mit 
            anderen Nutzern CO2-Fußabdrücke erfassen. So können Sie sich gegenseitig zu weiteren CO2 Einsparungen anregen.
            </Typography>
            <Typography>
Als eingeloggter Nutzer haben Sie die Möglichkeit, Gruppen zu erstellen und den Link oder QR-Code an 
Freunde, Familie, Sportkollegen, Kollegen und andere zu verteilen. Mit diesem System können alle Teilnehmer ohne Anmeldung ihre CO2-Fußabdrücke der Gruppe zuweisen.
</Typography>
            <Typography>
Der Zweck des Gruppensystems besteht darin, eine motivierende Umgebung zu schaffen, 
in der sich die Teilnehmer gegenseitig inspirieren können, CO2-Einsparungen zu erreichen. 
Indem Sie ihre Fortschritte innerhalb der Gruppe teilt, 
könnt ihr gemeinsam Ziele setzen, Wettbewerbe veranstalten oder euch einfach gegenseitig ermutigen, 
bewusste Entscheidungen zu treffen, um eure CO2-Bilanz zu verbessern.
</Typography>
            <Typography>
Wir legen großen Wert auf den Schutz Ihrer Daten. Innerhalb der Gruppe bleiben alle Daten anonym, 
sodass Sie Ihre CO2-Fußabdrücke sicher teilen können, ohne Ihre Privatsphäre zu gefährden. 
Ihre Informationen werden vertraulich behandelt und nicht mit anderen Gruppenmitgliedern geteilt.
</Typography>
            <Typography>
Nutzen Sie unser benutzerfreundliches Gruppensystem, um Teil einer aktiven Gemeinschaft zu werden, die gemeinsam daran arbeitet, den CO2-Ausstoß zu verringern. 
Gemeinsam können wir einen positiven Beitrag zum Umweltschutz leisten und uns gegenseitig dazu inspirieren, nachhaltigere Lebensstile anzunehmen.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNewGroup}
            >
              Neue Gruppe erstellen
            </Button>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="landingpage-buttons">
        <Button variant="contained" color="primary" onClick={handleCO2}>
          CO2 Rechner starten
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDashboard}>
          Zum Dashboard
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default Landingpage;
