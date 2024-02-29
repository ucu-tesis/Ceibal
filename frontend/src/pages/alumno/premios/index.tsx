import useFetchAchievements from '@/api/students/hooks/useFetchAchievements';
import CrossIcon from '@/assets/images/cross.svg';
import ImageButton from '@/components/buttons/ImageButton';
import ErrorPage from '@/components/errorPage/ErrorPage';
import LoadingPage from '@/components/loadingPage/LoadingPage';
import ModalDialog from '@/components/modals/ModalDialog';
import ProgressBar from '@/components/progress/ProgressBar';
import { Achievement } from '@/models/Achievement';
import Head from 'next/head';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import styles from './premios.module.css';

const Premios: React.FC = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement>();
  const [achievementModal, setAchievementModal] = useState(false);

  const { data: achievements, isLoading, isError } = useFetchAchievements();

  const onAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setAchievementModal(true);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.style.transform = 'scale(0.5)';
    }
    setTimeout(() => {
      setAchievementModal(false);
    }, 300);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage intendedAction="cargar tus logros" />;
  }

  const achievedCount = achievements.filter((a) => a.achieved).length;
  const progress = Math.round((achievedCount / achievements.length) * 100);

  return (
    <>
      <Head>
        <title>Colección de logros</title>
      </Head>
      <div className={`${styles.container} col`}>
        <h1 tabIndex={0}>Logros</h1>
        <ProgressBar value={progress}></ProgressBar>
        <div className={styles.spacer} />
        <div className={`${styles.achievements} row`}>
          {achievements.map((a) => {
            return (
              <ImageButton
                key={a.id}
                onClick={() => onAchievementClick(a)}
                src={a.imageUrl}
                altText={`Un logro ${
                  a.achieved ? 'completado' : 'por completar'
                }`}
                title={a.name}
                overlayText={a.achieved ? '¡Completado!' : undefined}
              />
            );
          })}
        </div>
      </div>
      {achievementModal && (
        <ModalDialog title="Detalle de logro" componentRef={modalRef}>
          <button onClick={closeModal} className={styles['close-btn']}>
            <Image src={CrossIcon} alt="cerrar modal"></Image>
          </button>
          <div className={`${styles['achievement-modal']} col`}>
            <ImageButton
              src={selectedAchievement?.imageUrl}
              unoptimized={true}
              altText={`Un logro ${
                selectedAchievement?.achieved ? 'completado' : 'por completar'
              }`}
              title=""
            />
            <div className="row">
              <div className="col">
                {selectedAchievement?.name && <strong>Logro</strong>}
                {selectedAchievement?.description && <strong>Detalle</strong>}
              </div>
              <div className="col">
                {selectedAchievement?.name && (
                  <span>{selectedAchievement.name}</span>
                )}
                {selectedAchievement?.description && (
                  <span>{selectedAchievement.description}</span>
                )}
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default Premios;
