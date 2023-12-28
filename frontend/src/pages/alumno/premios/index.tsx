import Head from "next/head";
import Image from "next/image";
import React, { useRef, useState } from "react";
import styles from "./premios.module.css";
import ProgressBar from "@/components/progress/ProgressBar";
import BronzeAward from "@/assets/images/premio_bronce.svg";
import ImageButton from "@/components/buttons/ImageButton";
import { bronzeAward, goldAward, silverAward } from "@/constants/constants";
import { Award } from "@/models/Award";
import ModalDialog from "@/components/modals/ModalDialog";
import CrossIcon from "@/assets/images/cross.svg";

const masterAwardList: Award[] = [
  {
    category: "BRONZE",
    title: "50% de los logros completados",
    description: "Haz completado el 50% de los logros. ¡Continua asi!",
    completed: true,
  },
  {
    category: "SILVER",
    title: "80% de los logros completados",
    description: "Haz completado el 80% de los logros. ¡Continua asi!",
    completed: true,
  },
  {
    category: "GOLD",
    title: "100% de los logros completados",
    description: "Haz completado el 100% de los logros. ¡Continua asi!",
    completed: true,
  },
];

const generalAwardList: Award[] = [
  {
    category: "BRONZE",
    title: "exploraste 5 lecturas",
    description: "Haz realizado 5 lecturas en esta plataforma. ¡Continua asi!",
    completed: true,
  },
  {
    category: "SILVER",
    title: "exploraste 10 lecturas",
    description: "Haz realizado 10 lecturas en esta plataforma. ¡Continua asi!",
    completed: true,
  },
  {
    category: "GOLD",
    title: "exploraste 20 lecturas",
    description: "Haz realizado 20 lecturas en esta plataforma. ¡Continua asi!",
    completed: false,
  },
  {
    category: "BRONZE",
    title: "primera lectura con 3 estrellas",
    description: "Haz completado tu primera lectura con 3 estrellas. ¡Continua asi!",
    completed: true,
  },
  {
    category: "BRONZE",
    title: "50% de los logros completados",
    description: "Haz completado el 50% de los logros. ¡Continua asi!",
    completed: true,
  },
];

const categoryAltText = {
  BRONZE: bronzeAward,
  SILVER: silverAward,
  GOLD: goldAward,
};

const toAwardButtonList = (awards: Award[]) => {
  return awards.map(({ category, completed, description, title }) => ({
    variant: category.toLowerCase(),
    altText: categoryAltText[category],
    overlayText: !completed ? "en proceso" : undefined,
    description,
    title,
  }));
};

const Premios: React.FC = () => {
  const [selectedAward, setSelectedAward] = useState<any>({});
  const [awardModal, setAwardModal] = useState(false);

  const onAwardClick = (award: any) => {
    setSelectedAward(award);
    setAwardModal(true);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.style.transform = "scale(0.5)";
    }
    setTimeout(() => {
      setAwardModal(false);
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Colección de premios</title>
      </Head>
      <div className={`${styles.container} col`}>
        <h1 tabIndex={0}>Logros</h1>
        <ProgressBar value={80}></ProgressBar>
        <h2 tabIndex={0}>Maestría de logros</h2>
        <div className={`${styles.awards} row`}>
          {toAwardButtonList(masterAwardList).map(({ variant, title, description, altText, overlayText }, index) => {
            return (
              <ImageButton
                key={index}
                onClick={
                  !overlayText
                    ? () => {
                        onAwardClick({ title, description, altText, variant });
                      }
                    : undefined
                }
                src={BronzeAward}
                altText={altText}
                title={title}
                variant={variant}
                overlayText={overlayText}
              ></ImageButton>
            );
          })}
        </div>
        <h2 tabIndex={0}>Generales</h2>
        <div className={`${styles.awards} row`}>
          {toAwardButtonList(generalAwardList).map(({ variant, title, description, altText, overlayText }, index) => {
            return (
              <ImageButton
                key={index}
                onClick={
                  !overlayText
                    ? () => {
                        onAwardClick({ title, description, altText, variant });
                      }
                    : undefined
                }
                src={BronzeAward}
                altText={altText}
                title={title}
                variant={variant}
                overlayText={overlayText}
              ></ImageButton>
            );
          })}
        </div>
      </div>
      {awardModal && (
        <ModalDialog title="Detalle de logro" componentRef={modalRef}>
          <button onClick={closeModal} className={styles["close-btn"]}>
            <Image src={CrossIcon} alt="cerrar modal"></Image>
          </button>
          <div className={`${styles["award-modal"]} col`}>
            <ImageButton
              src={BronzeAward}
              altText={selectedAward.altText}
              title={""}
              variant={selectedAward.variant}
            ></ImageButton>
            <div className="row">
              <div className="col">
                <strong>Logro</strong>
                <strong>Detalle</strong>
              </div>
              <div className="col">
                <span>{selectedAward.title}</span>
                <span>{selectedAward.description}</span>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default Premios;
