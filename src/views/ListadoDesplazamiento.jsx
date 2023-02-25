import React, { useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { getItems } from '../config/database'

export const ListadoDesplazamiento = () => {

  const [listado, setListado] = useState()
  const items = async() => {
    const data =  await getItems('tbl_recorrido', null)
    setListado(data);
  }
  items()

  const renderData = ({item}) => (
    <View>
      <Text>ID:{item.id} | Longitud: {item.longitud || "--"}, Latitud: {item.latitud || "--"}</Text>
      <Text></Text>
    </View>
  )

  return (
    <View>
      <Text>ListadoDesplazamiento</Text>
      {/* {listado} */}
      
      <FlatList data={listado} renderItem={renderData} />
    </View>
  )
}
