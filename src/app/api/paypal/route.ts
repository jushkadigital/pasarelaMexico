import axios from "axios"
import { NextRequest, NextResponse } from "next/server";

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
// const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// const client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
//

async function generateAccesToken() {
  try {
    const response = await axios({
      url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
      method: 'post',
      data: 'grant_type=client_credentials',
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET
      }
    })
    
    console.log(response.data.access_token)
    
    return response.data.access_token
  }
  catch (err) {
    throw new Error(err)
  }
}


export async function POST(request: NextRequest) {
  
  console.log("one")
  const accessToken = await generateAccesToken()
  console.log("two")
  console.log(accessToken)
  const dataBody = await request.json()
  console.log(dataBody)
  console.log(process.env.PAYPAL_BASE_URL + '/v2/checkout/orders')
  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    data: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: [
            {
              name: dataBody.namePaquete,
              description: 'Paquete a  Peru',
              quantity: 1,
              unit_amount: {
                currency_code: 'USD',
                value: parseFloat(dataBody.price).toFixed(2)
              }
            }
          ],
          amount: {
            currency_code: "USD",
            value: parseFloat(dataBody.price).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: parseFloat(dataBody.price).toFixed(2)
              }
            }
          },
          custom_id: dataBody.id
        }
      ],
      application_context: {
        return_url: process.env.NEXTAUTH_URL+"api/paypalreturn",
        cancel_url: process.env.NEXTAUTH_URL+"api/paypalreturn",
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW'
      }
    })
  })
  console.log(response.data)


  return NextResponse.json({
    "id": response.data.id,
    "cache": "update"
  }, { status: 200 })
}

export const revalidate = 0;
