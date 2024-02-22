import Recorder from '@/components/Recorder';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import TextContainer from '@/components/containers/TextContainer';
import ModalDialog from '@/components/modals/ModalDialog';
import Spinner from '@/components/spinners/Spinner';
import useFileUpload from '@/hooks/students/useFileUpload';
import { ReadingDetails } from '@/models/ReadingDetails';
import { Text } from '@chakra-ui/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import SendIcon from '../../assets/images/send_icon.svg';
import styles from './RecordScreen.module.css';

export interface RecordScreenProps {
  readingDetails: ReadingDetails;
}

const RecordScreen: React.FC<RecordScreenProps> = ({ readingDetails }) => {
  const router = useRouter();
  const [sendActive, setSendActive] = useState(false);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [bufferSource, setBufferSource] =
    useState<AudioBufferSourceNode | null>(null);
  const [mimeType, setMimetype] = useState<string>('');
  const [newRecord, setNewRecord] = useState(false);

  const [errorModal, setErrorModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const ref = useRef(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const errorModalRef = useRef<HTMLDivElement | null>(null);

  // Usar data que devuelve el hook
  const onSuccess = () => {
    setOpenModal(true);
  };

  const onError = (data: any) => {
    console.log(`error: ${JSON.stringify(error)}`); // TODO check why this is printing null
    console.error(data);
    setErrorModal(true);
  };

  const { mutate, isLoading, error } = useFileUpload(
    readingDetails.evaluationGroupReadingId, readingDetails.id
  );

  async function uploadFile(arrayBuffer: ArrayBuffer, mimeType: string) {
    const fileExtension = getFileExtension(mimeType);
    const file = new File([arrayBuffer], `audio-file.${fileExtension}`, {
      type: mimeType,
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      mutate(formData, { onSuccess, onError });
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorModal(true);
    }
  }

  function getFileExtension(mimeType: string) {
    const mimeToExtensionMap: { [key: string]: string } = {
      'audio/mpeg': 'mp3',
      'audio/mp4': 'm4a',
      'audio/ogg': 'ogg',
      'audio/webm': 'webm',
      'audio/wav': 'wav',
    };
    return mimeToExtensionMap[mimeType] || 'unknown';
  }

  const onSend = () => {
    bufferSource?.stop();
    if (buffer) {
      uploadFile(buffer, mimeType).then(() => {
        setSendActive(false);
        setNewRecord(true);
        if (recorder) {
          recorder.style.animation = 'appear 0.6s ease-in-out';
        }
      });
      const recorder = divRef.current;
      if (recorder) {
        recorder.style.animation = 'vanish 0.6s ease-in-out';
      }
      if (ref.current) {
        const sendButton = ref.current as HTMLElement;
        sendButton.style.animation = 'vanish 0.6s ease-in-out';
      }
    }
  };

  const onComplete = (buffer: ArrayBuffer, mimeType: string) => {
    setBuffer(buffer);
    setMimetype(mimeType);
    setSendActive(true);
  };

  const onRecording = () => {
    setSendActive(false);
    setNewRecord(false);
  };

  const closeModalAndPushReadingsListScreen = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.style.transform = 'scale(0.5)';
    }
    setTimeout(() => {
      setOpenModal(false);
      router.push('/alumno/lecturas');
    }, 300);
  };

  const closeErrorModal = () => {
    const modal = errorModalRef.current;
    if (modal) {
      modal.style.transform = 'scale(0.5)';
    }
    setTimeout(() => {
      setErrorModal(false);
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Grabar - Ceibal</title>
        <meta name="description" content="Grabar una lectura" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container col">
          {openModal && (
            <ModalDialog componentRef={modalRef} title="¡Genial!">
              <div className="progress col">
                <Text fontSize={16} lineHeight={2}>
                  Tu lectura se ha enviado correctamente. ¡Felicidades!
                  <br />
                  Ahora puedes continuar explorando y aprendiendo.
                </Text>
                <SecondaryButton
                  onClick={closeModalAndPushReadingsListScreen}
                  variant={'blueFill' as keyof Object}
                >
                  Continuar
                </SecondaryButton>
              </div>
            </ModalDialog>
          )}
          {errorModal && (
            <ModalDialog componentRef={errorModalRef} title="Ups">
              <span>
                Lo sentimos, tu lectura no se ha podido enviar. Inténtalo de
                nuevo más tarde o pide ayuda a un adulto.
              </span>
              <SecondaryButton
                onClick={closeErrorModal}
                variant={'redFill' as keyof Object}
              >
                Cerrar
              </SecondaryButton>
            </ModalDialog>
          )}
          <div className={`${styles['reading-info-container']}`}>
            {readingDetails.title && (
              <h1 className={styles.title}>{readingDetails.title}</h1>
            )}
            {readingDetails.category && (
              <h2 className={styles.subtitle}>
                Categoría: {readingDetails.category}
              </h2>
            )}
            {readingDetails.subcategory && (
              <h2 className={styles.subtitle}>
                Subcategoría: {readingDetails.subcategory}
              </h2>
            )}
          </div>
          <TextContainer content={readingDetails.content} />
          {!isLoading ? (
            <>
              <Recorder
                componentRef={divRef}
                onComplete={onComplete}
                newRecord={newRecord}
                onRecording={onRecording}
                bufferSource={bufferSource}
                setBufferSource={setBufferSource}
              ></Recorder>
              {sendActive && (
                <PrimaryButton
                  buttonRef={ref}
                  onClick={onSend}
                  variant={'large' as keyof Object}
                >
                  <div>
                    <Image src={SendIcon} alt=""></Image>
                  </div>
                  <div>Enviar</div>
                </PrimaryButton>
              )}
            </>
          ) : (
            <Spinner />
          )}
        </div>
      </main>
    </>
  );
};

export default RecordScreen;
