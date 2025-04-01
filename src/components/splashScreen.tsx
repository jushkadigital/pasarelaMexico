import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image"
import logo from "/public/logoBlanco.png"
import backgroundImage from "/public/machupicchu.jpg"
const SplashScreen = ({onAnimationComplete   }:{onAnimationComplete:()=>void}) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 ,type: "easeIn"}}
      onAnimationComplete={onAnimationComplete}
    >
  <Image
    src={backgroundImage} // Importa la imagen en tu archivo
    alt="background"
    layout="fill"
    objectFit="cover"
    className="absolute inset-0 -z-10"
  />
      <Image src={logo} alt="a" height={200} width={200}/>
    </motion.div>
  );
};


export default SplashScreen;
