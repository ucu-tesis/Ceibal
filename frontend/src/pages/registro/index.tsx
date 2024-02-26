import RoundedButton from '@/components/buttons/RoundedButton';
import InputPassword from '@/components/inputs/InputPassword';
import InputText from '@/components/inputs/InputText';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect } from 'react';
import LogoCeibal from '../../assets/images/logo_ceibal.png';
import RightIcon from '../../assets/images/right_icon.svg';
import styles from './registro.module.css';

const Registro: React.FC = () => {
  useEffect(() => {
    document.getElementById('header')?.remove();
    document.querySelector('hr')?.remove();
  }, []);

  return (
    <>
      <Head>
        <title>Registro</title>
      </Head>
      <div className={`${styles['login-layout']} row`}>
        <div className={`${styles['col']}`}>
          <Image src={LogoCeibal} alt=""></Image>
          <p>Registro</p>
          <div className={`${styles['row']}`}>
            <InputText placeholder="Primer Nombre"></InputText>
            <InputText placeholder="Segundo Nombre"></InputText>
          </div>
          <InputText placeholder="Apellido"></InputText>
          <InputText placeholder="Correo"></InputText>
          <InputText placeholder="Documento"></InputText>
          <InputPassword placeholder="Contraseña"></InputPassword>
          <InputPassword placeholder="Repetir Contraseña"></InputPassword>
          <RoundedButton variant="black">
            <div>Registrarse</div>
            <Image src={RightIcon} alt=""></Image>
          </RoundedButton>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Registro;
