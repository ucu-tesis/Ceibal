import React from "react";
import styles from "./Container.module.css";

const TextContainer: React.FC = () => {
  const sampleText = `Timotea era una ñandú muy especial. Cuando era pequeña se podía decir que Timotea era charito y cuando creció un
    poco se le podía decir charabona, pero ahora que ya medía más de un metro y pesaba casi veinticinco kilos, Timotea
    era una ñandú hecha y derecha. Tenía las plumas de un lindísimo color gris, las pestañas largas y un poco más
    arqueadas que sus amigas y unos ojos pardos que parecían soñar con lugares más allá del campo donde vivía. El campo
    era su hogar, su mundo conocido. Allí desde pequeña corría de un lado a otro. Largas andanzas que interrumpía para
    alimentarse con frutas silvestres, hojas, semillas y algunos insectos y batracios que conseguía a fuerza de mucha
    paciencia.`;
  return <div className={`${styles.text_container}`}>{sampleText}</div>;
};

export default TextContainer;
