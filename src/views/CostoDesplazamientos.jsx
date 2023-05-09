import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useContext } from 'react'

import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext'

const CostoDesplazamientos = () => {

    const { listMedios } = useContext(DesplazamientoContext)


    return (
        <View>
            <Text>CostoDesplazamientos</Text>
            <Text>{JSON.stringify(listMedios)}</Text>
        </View>
    )
}

export default CostoDesplazamientos

const styles = StyleSheet.create({})