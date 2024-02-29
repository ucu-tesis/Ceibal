import { useEffect, useState } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import styles from './evaluacion.module.css';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import PlayIcon from '@/assets/images/play_icon.svg';
import StopIcon from '@/assets/images/pause_icon.svg';
import Head from 'next/head';
import { FastAverageColor } from 'fast-average-color';
import Star from '@/assets/images/star_eval.svg';
import StarOutlined from '@/assets/images/star_eval_outlined.svg';
import { useQuery } from '@tanstack/react-query';
import { fetchRecording } from '@/api/students/students';
import LoadingPage from '@/components/loadingPage/LoadingPage';
import ErrorPage from '@/components/errorPage/ErrorPage';

const useFetchRecordings = (recordingId: number) =>
  useQuery({
    queryKey: ['student', 'recording', recordingId],
    queryFn: () => fetchRecording(recordingId),
  });

const mozaicFont = localFont({
  src: [
    {
      path: '../../../../assets/fonts/ceibalmozaic-regular-webfont.woff2',
      style: 'normal',
    },
  ],
});

export default function Page() {
  const { evaluacion } = useRouter().query;

  const { data, isError, isLoading } = useFetchRecordings(Number(evaluacion));

  const {
    analysis_score: score,
    reading_title: title,
    reading_image: imageURL,
    reading_category: category,
    reading_subcategory: subCategory,
    url,
  } = data ?? {
    analysis_score: 0,
    reading_title: undefined,
    reading_image: undefined,
  };

  const starsCount = Math.round(score / 20);

  const [imageAverageColor, setImageAverageColor] = useState<string>();

  const [audioPlaying, setAudioPlaying] = useState(false);

  const onClickPlay = () => {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (!audioPlaying) {
      setAudioPlaying(true);
      audioElement?.play();
    } else {
      audioElement?.pause();
      setAudioPlaying(false);
    }
  };

  useEffect(() => {
    const fac = new FastAverageColor();
    const container = document.getElementById('container');
    if (container) {
      fac
        .getColorAsync(container.querySelector('img'))
        .then(({ hex }) => setImageAverageColor(hex));
    }
  }, [data]);

  const stars = Array.from({ length: 5 }, (_, index) => (
    <Image
      key={`star-${index}`}
      src={starsCount > index ? Star : StarOutlined}
      alt="estrella"
    />
  ));

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage intendedAction="cargar tu evaluación" />;
  }

  return (
    <>
      <Head>
        <title>Resultado de Evaluación</title>
      </Head>
      <div id="container" className={`${styles.container} col`}>
        <h1>Resultado de Evaluación</h1>
        <h2>{title}</h2>
        <img
          className={styles.rounded}
          src={imageURL ?? ''}
          width={300}
          height={400}
          alt={`imagen de lectura: ${title}`}
          style={{ border: `2px solid ${imageAverageColor}` ?? 'unset' }}
          crossOrigin="anonymous"
        />
        <div className={`${styles.info} row`}>
          <div className="row">
            <label>Categoría:</label>
            <span>{category}</span>
          </div>
          <div className="row">
            <label>Subcategoría:</label>
            <span>{subCategory}</span>
          </div>
        </div>
        <div className={`${styles.stars} row`}>{stars}</div>
        <SecondaryButton
          onClick={onClickPlay}
          variant={'outlined' as keyof Object}
        >
          <div>
            {audioPlaying ? (
              <Image src={StopIcon} alt=""></Image>
            ) : (
              <Image src={PlayIcon} alt=""></Image>
            )}
          </div>
          <div style={{ fontFamily: mozaicFont.style.fontFamily }}>
            {audioPlaying ? 'Parar' : 'Reproducir'}
          </div>
        </SecondaryButton>
        <audio>
          <source src={url} />
        </audio>
      </div>
    </>
  );
}
