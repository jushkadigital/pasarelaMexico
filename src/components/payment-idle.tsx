'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { TablaCotizacion } from "./tabla-cotizacion"
import {useMobile} from "@/hooks/useMobile"
import {PayPalScriptProvider ,PayPalButtons} from "@paypal/react-paypal-js"
import { useTranslation } from "@/i18next/client"


interface Props {
params : any,
setMethod: React.Dispatch<React.SetStateAction<"idle" | "loading" | "success" | "failed">>,
link:string
termsAndCondition:string
lng:string
}

const fakePaymentProcessing = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Cambia esto para simular éxito o error
      const isSuccess = true
      isSuccess ? resolve(undefined) : reject(new Error('Payment failed'));
    }, 2000); // Simula 2 segundos de procesamiento
  });

export const PaymentIdleForm = ({params,setMethod,link,termsAndCondition,lng}:Props) => {

  const isMobile = useMobile()
  const [dialogOpen, setDialogOpen] = useState(false)

  const [adultPassengers,setAdultPassengers] = useState<number>(1)

  const [minorPassengers,setMinorPassengers] = useState<number>(0)

  const [childPassengers,setChildPassengers] = useState<number>(0)



  const validateDate = {
    'before':{
      adult: params['unitaryPriceAdultBefore'],
      minor: params['unitaryPriceMenorBefore'],
      child: params['unitaryPriceChildBefore']
    }
    ,
    'in':{
      adult:params['unitaryPriceAdultIn'],
      minor: params['unitaryPriceMenorIn'],
      child: params['unitaryPriceChildIn']
    },
    'after': {
    adult: params['unitaryPriceAdultAfter'],
    minor: params['unitaryPriceMenorAfter'],
    child: params['unitaryPriceChildAfter']
    },
  }


  function getCurrentDate(){
    const fecha = new Date();
const dia = String(fecha.getDate()).padStart(2, '0');
const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
const año = String(fecha.getFullYear()).slice(-2);

  const formato = `${dia}/${mes}/${año}`;
  return formato

  }


  const ff = ["before","in","after"]

function encontrarIndiceFecha(fechaStr, rangos) {
    console.log(fechaStr)
    console.log(rangos)
    console.log(ff)
    // Función para convertir "dd/mm/yy" a objeto Date
    const parseFecha = (fecha) => {
      const [dia, mes, año] = fecha.split('/').map(Number);
      return new Date(2000 + año, mes - 1, dia); // Convertimos el año a "20xx"
    };
  
    const fecha = parseFecha(fechaStr);
  
    for (let i = 0; i < rangos.length; i++) {
      const [inicioStr, finStr] = rangos[i];
      const inicio = parseFecha(inicioStr);
      const fin = parseFecha(finStr);
  
      if (fecha >= inicio && fecha <= fin) {
        console.log(i)
        return i; // Retorna el índice del array donde la fecha está dentro del rango
      }
    }
  
    return -1; // Retorna -1 si la fecha no está en ningún rango
  }

  const fechasFormated = params.fechas.split("||").map(ele=> ele.split('-'))
  console.log(fechasFormated)
  

  //Validacion para el nombre del CardHolder
  const cardHolderSchema = z.string().max(40, { message: "El nombre es muy largo" }).min(1,{message: "El campo no debe estar vacio"})

  // Validación para el correo electrónico 
  const emailSchema = z
    .string()
    .email("Debe ser un correo electrónico válido").min(1,{message: "El campo no debe estar vacio"})

  //Validacion de Terminos y Condicitones
  const termsAndConditionSchema = z.boolean().refine((val) => val, {
    message: "Debes aceptar los términos y condiciones.",
  })

  const priceSchema = z
  .number({
    required_error: "El precio es obligatorio",
    invalid_type_error: "El precio debe ser un número",
  })
  .positive("El precio debe ser un número positivo")
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toString()), {
    message: "El precio debe tener máximo dos cifras decimales",
  });


  const mexicoCelularSchema = z
  .string()
  .transform((val) => {
    // elimina espacios y guiones
    const cleaned = val.replace(/[\s-]/g, "");

    // elimina prefijos +52, 52, +521, 521 si existen
    const withoutPrefix = cleaned.replace(/^(\+?52)?1?/, "");

    return withoutPrefix;
  })
  .refine((val) => /^[1-9]\d{9}$/.test(val), {
    message: "Debe ser un número celular válido de México (10 dígitos, sin empezar en 0)",
  }); 

//const numPassengersSchema = z.number({
//    required_error: "min 1",
//    invalid_type_error: "number ",
//  })
//  .positive("positive")

const namePaquetSchema = z.string().max(50,{message: "El nombre es muy largo"}).min(1,{message: "El campo no debe estar vacio"})
  // Esquema para métodos de pago específicos

const creditCardSchema = z.object({
    method: z.literal("credit_card"),
    namePaquete: namePaquetSchema,
    cardHolder: cardHolderSchema,
    termsAndCondition: termsAndConditionSchema,
    email: emailSchema,
    cel: mexicoCelularSchema
  });

  const increaseAdultNumber = ()=>{
    setAdultPassengers(prev=> prev < 50 ? prev+1 : prev)
  }
  const decreaseAdultNumber = ()=>{
    setAdultPassengers(prev=> prev > 1 ? prev-1 : prev)
  }
  
  
  const increaseMinorNumber = ()=>{
    setMinorPassengers(prev=> prev < 50 ? prev+1 : prev)
  }
  const decreaseMinorNumber = ()=>{
    setMinorPassengers(prev=> prev > 0 ? prev-1 : prev)
  }

const increaseChildNumber = ()=>{
    setChildPassengers(prev=> prev < 50 ? prev+1 : prev)
  }
  const decreaseChildNumber = ()=>{
    setChildPassengers(prev=> prev > 0 ? prev-1 : prev)
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


  const EEE = "aooa@gmail.com"
  const form = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    mode: "onChange",
    defaultValues: {
      method: "credit_card",
      namePaquete: params.namePaquete || "", 
      cardHolder:  "",
      termsAndCondition: false,
      email: "",
      cel: "+52"
      // email: decodeBase64UrlSafe(EEE) || "",
      // price: parseFloat(params.finalPrice) || 0
    },
  })

  // const [paypalState,setPaypalState] = useState(false)


  const termsWatch = form.watch("termsAndCondition")

  

  async function onSubmit(values: z.infer<typeof creditCardSchema>) {
    console.log(values)
    await handlePayment(values)
  }

const handlePayment = async (values:any) => {
    setMethod('loading'); // Muestra el componente de carga
    
    try {
      // Simula el procesamiento del pago
      
    const link =  await IzipayGetLink(values);

      // Si el pago es exitoso
    window.location.href = link

    } catch (error) {
      // Si ocurre un error en el pago
    }
  };
  console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)
  console.log(termsWatch)

  const unitaryPriceSub1 = encontrarIndiceFecha(getCurrentDate(),fechasFormated) == -1?  encontrarIndiceFecha("04/04/25",fechasFormated): encontrarIndiceFecha(getCurrentDate(),fechasFormated)

  const {adult,minor,child} = validateDate[ff[unitaryPriceSub1]]

  const totalAmount = adult * adultPassengers + minor * minorPassengers + child * childPassengers

  const IzipayGetLink = async (values:any) => {
       
      
      const paymentConf = {
        amount: Math.round(Number(totalAmount*params.percentaje/100) * 100),
        currency: "USD",
        customer: {
          reference: "AG0",
          email: values.email
          // email: decodeBase64UrlSafe(email),
        },
        orderId: `order-${Date.now()}`
      }
      console.log(paymentConf)
      const response = await fetch(`/api/createpayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...paymentConf}),
      });
      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }
      const result = await response.json();
      const urlPayment = JSON.parse(result.message).answer.paymentURL
      return urlPayment
    }
  const {t} = useTranslation(lng,'translation')
  return (
  <div className="flex  flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 ">
        <Form {...form} >
          <form id="formPDS" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 lg:space-y-8 lg:h-[80vh]">
            <div className="w-full">
              <FormField
                control={form.control}
                name="namePaquete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('packageName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('packageNamePlace')}
                        {...field}
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                )}
                  
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('passengerName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('passengerNamePlace')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-between">
                <div className="w-1/3">
                    <FormLabel>{t('adults')}</FormLabel>
                <Input value={adultPassengers}/>
                <div className="flex flex-row">

                <Button type="button" onClick={()=>increaseAdultNumber()} 
                className="w-10 h-10 rounded-full 
                text-white text-2xl font-bold flex items-center justify-center shadow-md
                 transition duration-200 ease-in-out focus:outline-none focus:ring-2
                  focus:ring-red-400 focus:ring-opacity-50"
                >
                  +
                </Button>
                <Button type="button" onClick={decreaseAdultNumber}
                className="w-10 h-10 rounded-full 
                text-white text-2xl font-bold flex items-center justify-center shadow-md
                 transition duration-200 ease-in-out focus:outline-none focus:ring-2
                  focus:ring-red-400 focus:ring-opacity-50"
                >
                  -
                </Button>
                </div>
                </div>
                <div className="w-1/3">
                    <FormLabel>{t('minors')}(7-14)</FormLabel>
                <Input value={minorPassengers}/>
                <div className="flex flex-row">
                <Button type="button" onClick={()=>increaseMinorNumber()} 
                className="w-10 h-10 rounded-full 
                text-white text-2xl font-bold flex items-center justify-center shadow-md
                 transition duration-200 ease-in-out focus:outline-none focus:ring-2
                  focus:ring-red-400 focus:ring-opacity-50"
                >
                  +
                </Button>
                <Button type="button" onClick={()=>decreaseMinorNumber()}
                className="w-10 h-10 rounded-full 
                text-white text-2xl font-bold flex items-center justify-center shadow-md
                 transition duration-200 ease-in-out focus:outline-none focus:ring-2
                  focus:ring-red-400 focus:ring-opacity-50"
                >
                  -
                </Button>
                </div>
                </div>
                 <div className="w-1/3">
                    <FormLabel>{t('childs')}(3-7)</FormLabel>
                <Input value={childPassengers}/>
                <div className="flex flex-row">
                <Button type="button" onClick={()=>increaseChildNumber()} 
                className="w-10 h-10 rounded-full 
                text-white text-2xl font-bold flex items-center justify-center shadow-md
                 transition duration-200 ease-in-out focus:outline-none focus:ring-2
                  focus:ring-red-400 focus:ring-opacity-50"
                >
                  +
                </Button>
                <Button type="button" onClick={()=>decreaseChildNumber()}
                className="w-10 h-10 rounded-full 
                text-white text-2xl font-bold flex items-center justify-center shadow-md
                 transition duration-200 ease-in-out focus:outline-none focus:ring-2
                  focus:ring-red-400 focus:ring-opacity-50"
                >
                  -
                </Button>
                </div>
                </div>

              </div>

            </div>
              <div className="w-full">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('passengerEmail')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('passengerEmailPlace')}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            </div>
            <div className="w-full">
                <FormField
                control={form.control}
                name="cel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phone')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="termsAndCondition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('termsCond')}
                </FormLabel>
                <FormDescription>
                  {t('termsCondParagraph')}<br/>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-sm"> {t('termsCondButton')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('termsCond')}</DialogTitle>
                    <DialogDescription dangerouslySetInnerHTML={{ __html: termsAndCondition }} className="tourQWERTY  overflow-y-auto  h-[75vh] text-justify">
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
                </FormDescription>
              </div>
            </FormItem>
                )}
              />
            </div>

          </form>
        </Form>
        </div>
        <div>
        <div className="w-full  flex flex-col justify-stretch">
        <TablaCotizacion  lng={lng} unitaryPrice={adult} unitaryPrice2={minorPassengers > 0 ? minor: ""} unitaryPrice3={childPassengers > 0 ? child: ""} finalPrice={(totalAmount)}  percentage={params.percentaje} subPrice1={String(totalAmount*params.percentaje/100)} subPrice2={String(totalAmount*(100-params.percentaje)/100)} />
        </div>
            { true &&
           <div className="w-full space-y-2 lg:space-y-4">
            <div className="w-full lg:mt-10" >
              <Button disabled={!termsWatch} type="submit" form="formPDS" className="w-full max-w-[750px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 flex items-center justify-center space-x-2" >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>               
                
                {t('cardButton')}</Button>
            </div>
              <div className="w-full h-36 mt-5">
                {t('advisePaypal')}
              <PayPalScriptProvider options={{clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}}>
                <PayPalButtons 
                  style={{color:"gold",layout: "horizontal"}}
                  className="w-full"
                  disabled={!termsWatch}
                  createOrder={async()=> {
                    const res = await fetch('/api/paypal',{
                      method: "POST",
                      body: JSON.stringify({
                        namePaquete: params.namePaquete,
                        price: params.unitaryPriceSub1
                      })
                    })
                    const order = await res.json()
                    console.log(order)
                    return order.id
                  }}
                  onApprove={async(data,actions)=>{
                 const aa = await actions.order.capture()
                 console.log(aa)
                  }}
                />
              </PayPalScriptProvider>
            </div>
            </div>
            
            }
            </div>
        </div>
  )
}
