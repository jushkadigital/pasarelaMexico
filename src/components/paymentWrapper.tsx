'use client'
import { PaymentMethodForm } from "./payment-method-form"
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from "next/image"

interface Props {
defaultData: any,
dataSen: any
info:any
lng:string
}

export const PaymentWrapper = ({defaultData,dataSen,info,lng}:Props)=> {

  
  return (
    <div className="relative w-full flex justify-center ">
            {/* Fondo oscuro con flex para centrar el pop-up */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black z-10 flex items-center justify-center w-full h-screen"
            />

            {/* Pop-up centrado */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bg-white rounded-lg shadow-lg z-20 flex items-center justify-center"
            >
            
              <PaymentMethodForm defaultData={defaultData} dataSen={dataSen} info={info} lng={lng}/>
            </motion.div>
    </div>
  
  )
}
