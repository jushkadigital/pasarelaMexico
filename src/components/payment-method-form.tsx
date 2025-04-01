'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { PaymentIdleForm } from "./payment-idle"
import { PaymentLoadingForm } from "./payment-loading"
import { PaymentSuccessForm } from "./payment-success"
import SplashScreen from "./splashScreen"
import Image from "next/image"
import logo from "/public/pdsViajesLogo.png"


import { Button } from "@/components/ui/button"

interface Props {
  defaultData: any
  dataSen: any
  info:any
  lng: string
}



export const PaymentMethodForm = ({ defaultData, dataSen,info,lng}: Props) => {


  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed">('idle');

  
  const [link, setLink] = useState('')

  const cases = {
    idle: () =>
      <motion.div
        key="idle"
      > <PaymentIdleForm lng={lng} params={dataSen} setMethod={setStatus} link={link} termsAndCondition={info} /> </motion.div>,
    loading: () =>
      <motion.div
        key="loading"
        className="w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <PaymentLoadingForm />
      </motion.div>,
    success: () =>
      <motion.div
        key="success"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <PaymentSuccessForm />
      </motion.div>,
    default: () => <motion.div></motion.div>,
    failed: () =>
      <motion.div
        key="success"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <PaymentSuccessForm />
      </motion.div>,


  }

function decodeBase64UrlSafe(encoded:string) {
    // Restaurar padding si falta
    const paddingNeeded = encoded.length % 4;
    if (paddingNeeded) {
        encoded += "=".repeat(4 - paddingNeeded);
    }

    // Reemplazar caracteres URL-safe con los de Base64 estándar
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");

    // Decodificar usando atob()
    return atob(encoded);
}

  type ccases = typeof cases

  const executeSwitchCases = (cases: ccases) => (key: "idle" | "loading" | "success" | "failed") => (cases[key] || cases.default)()

  const functionSwitch = executeSwitchCases(cases)

  console.log(process.env.NEXT_PUBLIC_KEY);

  const [isSplashVisible, setIsSplashVisible] = useState(true);
  // useEffect(() => {
  //   // Ocultar el splash screen después de 3 segundos
  //   const timer = setTimeout(() => {
  //     setIsSplashVisible(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      <AnimatePresence>
        {isSplashVisible && <SplashScreen onAnimationComplete={() => setIsSplashVisible(false)} />}
      </AnimatePresence>
      {!isSplashVisible &&
        <Card className="w-[95vw] lg:w-[85vw]">
          <CardHeader className="my-0 py-0 flex justify-center flex-row">
            
      <Image src={logo} alt="a" height={100} width={100}/>
          </CardHeader>
          <CardContent className="lg:px-24 w-full h-full">
            {functionSwitch(status)}
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>}
    </>
  )
}
