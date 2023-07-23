import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useDisclosure } from "@chakra-ui/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { SearchIcon, ChevronRightIcon, AddIcon } from "@chakra-ui/icons";
import { useParams } from 'next/navigation'
import Select from "@/components/selects/Select";
import styles from "./evaluaciones.module.css";

type Option = {
  value?: string;
  label: string;
};

type Group = {
  name: string;
  year: string;
};

export default function Page({ params }: { params: { grupo: string } }) {
    const router = useRouter();
    return <h1>Grupo {router.query.grupo}</h1>
}
