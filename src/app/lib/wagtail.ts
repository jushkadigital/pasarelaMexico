const API_URL = 'https://paymentserver.pdsviajes.com/api/v2/'

async function fetchAPI(query = '', variable: any = null) {
  // const headers: any = { 'Content-Type': 'application/json' }
  if (variable) {
    const queryString = Object.keys(variable)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(variable[key])}`)
      .join('&');

    try {
      // const res = await axios.get(API_URL + query + '?'+ queryString,{
      const res = await fetch(API_URL + query + '?' + queryString, {
        cache: 'no-store'
      })
      const data = await res.json()
      return data
    }
    catch (error) {
      console.log(API_URL + query + '?' + queryString)
      console.log("ERRORRR en FETCH")
    }



  } else {

    try {
      const res = await fetch(API_URL + query, {
        // cache: 'no-store'
      })
      const data = await res.json()
      return data
    }
    catch (error) {
      console.log("ERRORRR en FETCH")
    }


  }
}


export async function getDataGeneral(variables:any){
  const data = await fetchAPI('snippets/dataGeneral',variables)
  return data
}

export async function getDataPaqueteMexico(variables:any){
  const data = await fetchAPI('snippets/dataPaquete',variables)
  return data
}

