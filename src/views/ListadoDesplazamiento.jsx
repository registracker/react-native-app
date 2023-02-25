import React, { useState } from 'react'
import { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { getDesplazamientos } from '../database/TblDesplazamientos'

export const ListadoDesplazamiento = () => {

  const [listado, setListado] = useState()
  const items = () => {
    const data = getDesplazamientos();
    console.log("🚀 ~ file: ListadoDesplazamiento.jsx:10 ~ items ~ data:", data)
    setListado(data);
  }
  
  useEffect(() => {
    
    items()
  
  }, [])
  


  return (
    <View>
      <Text>ListadoDesplazamiento {JSON.stringify(listado)}</Text>

    </View>
  )
}
