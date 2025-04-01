import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTranslation } from "@/i18next/client"

interface Props {
unitaryPrice: string
unitaryPrice2?: string
unitaryPrice3?: string
finalPrice: number
percentage: string
subPrice1: string
subPrice2: string
lng:string
}

export const TablaCotizacion = ({lng,unitaryPrice,unitaryPrice2,unitaryPrice3,finalPrice,percentage,subPrice1,subPrice2}:Props)=> {
  
  const {t} = useTranslation(lng,'tablaCoti')
  return (
    <Table>
      <TableCaption>{t('quotationTable')}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">{t('itemBill')}</TableHead>
          <TableHead>{t('detail')}</TableHead>
          <TableHead className="text-right">{t('price')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">{t('unitaryPrice')}</TableCell>
          <TableCell>{t('priceAdultPassenger')}</TableCell>
          <TableCell className="text-right">${unitaryPrice}</TableCell>
        </TableRow>
        {unitaryPrice2 && 
          <TableRow>
          <TableCell className="font-medium">{t('unitaryPrice')}</TableCell>
          <TableCell>{t('priceMinorPassenger')}</TableCell>
          <TableCell className="text-right">${unitaryPrice2}</TableCell>
        </TableRow>
}
        
        {unitaryPrice3 && 
          <TableRow>
          <TableCell className="font-medium">{t('unitaryPrice')}</TableCell>
          <TableCell>{t('priceChildPassenger')}</TableCell>
          <TableCell className="text-right">${unitaryPrice3}</TableCell>
        </TableRow>
}

        
        
        <TableRow>
          <TableCell className="font-medium">{t('totalPrice')}</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">${finalPrice.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">{t('advancePayment')}</TableCell>
          <TableCell>{percentage}% </TableCell>
          <TableCell className="text-right">${subPrice1}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">{t('toPayment')}</TableCell>
          <TableCell>{100-Number(percentage)}% </TableCell>
          <TableCell className="text-right">${subPrice2}</TableCell>
        </TableRow>

      </TableBody>
    </Table>
  )
}

