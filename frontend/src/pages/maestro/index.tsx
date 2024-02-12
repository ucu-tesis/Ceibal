import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser } from '@/providers/UserContext';
import styles from './maestro.module.css';
import { ChakraProvider } from '@chakra-ui/react';
import TeacherCardButton from '@/components/buttons/TeacherCardButton';
import { AddIcon } from '@chakra-ui/icons';
import ReadingBook from '@/assets/images/reading-book.png';
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
            leftIcon={<Image src={Groups} alt="ver grupos" />}
            text="Ver Grupos"
            onClick={() => router.push(`${currentPathName}/grupos`)}
          ></TeacherCardButton>
        </div>
        <div>
          <TeacherCardButton
            leftIcon={<Image src={ReadingBook} alt="ver lecturas" />}
            text="Ver Lecturas"
            onClick={() => {}}
          ></TeacherCardButton>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default TeacherHomeScreen;
