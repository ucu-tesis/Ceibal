import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser } from '@/providers/UserContext';
import styles from './maestro.module.css';
import { ChakraProvider } from '@chakra-ui/react';
import TeacherCardButton from '@/components/buttons/TeacherCardButton';
import ReadingBookOverlay from '@/assets/images/reading-book-full.png';
import ReadingBook from '@/assets/images/reading-book.png';
import GroupsOverlay from '@/assets/images/groups-full.png';
import Groups from '@/assets/images/groups.png';

const TeacherHomeScreen: React.FC = () => {
  const router = useRouter();
  const user = useUser();

  const currentPathName = router.pathname;

  return (
    <ChakraProvider>
      <Head>
        <title>Menú Principal</title>
      </Head>
      <div className={`${styles.container} row`}>
        <div>
          <TeacherCardButton
            icon={<Image src={Groups} alt="ver grupos" />}
            backgroundImage={<Image src={GroupsOverlay} alt="ver grupos" />}
            text="Grupos"
            onClick={() => router.push(`${currentPathName}/grupos`)}
          ></TeacherCardButton>
        </div>
        <div>
          <TeacherCardButton
            icon={<Image src={ReadingBook} alt="ver lecturas" />}
            backgroundImage={
              <Image src={ReadingBookOverlay} alt="ver lecturas" />
            }
            text="Lecturas"
            onClick={() => router.push(`${currentPathName}/lecturas`)}
          ></TeacherCardButton>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default TeacherHomeScreen;
