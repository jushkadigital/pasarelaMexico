import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {

  const data = await request.json()

  console.log(data)
  const id = data.id

  console.log(id)
try{
    
    const response = await fetch(`https://paymentserver.pdsviajes.com/api/my/datapasajero/${id}/`,{
    body: JSON.stringify({
      status: "paypal"
    }),
    headers: {
          'Content-Type': 'application/json'
        },
    method: "PATCH"
  }) 

  console.log(response)
    return NextResponse.json({
    "message": "nice",
    "cache": "update"
     }, { status: 200 })

  }
  catch(err) {
    throw new Error(err)
  }

  
  return NextResponse.json({
    "message": "aoeaoe",
    "cache": "update"
  }, { status: 200 })
}

export const revalidate = 0;


