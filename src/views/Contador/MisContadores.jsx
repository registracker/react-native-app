import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { getMisContadores } from '../../services/contadorServices'
import { useEffect } from 'react'
import { useContext } from 'react'
import { ContadorContext } from '../../context/levantamiento/ContadorContext'
import { primary, styles } from '../../styles/style'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from '@rneui/base'
import { format, parseISO } from 'date-fns'
import { truncateText } from '../../utils/functions'
import { ActivityIndicator } from 'react-native'
import { showToast } from '../../utils/toast'

export const MisContadores = ({ navigation }) => {

    const { getUltimoContador, guardar } = useContext(ContadorContext)

    const [misContadores, setMisContadores] = useState([])
    const [loading, setLoading] = useState(false)

    const obtenerContadores = async () => {
        setLoading(true)
        const contador = await getUltimoContador()
        const { data } = await getMisContadores()
        setMisContadores(data)
        if (contador) {
            navigation.navigate('Contador')
        } 
        setLoading(false)
    }

    const unirseLevantamiento = async (levantamiento) => {
        setLoading(true)
        if (levantamiento) {
            const response = await guardar(levantamiento);
            if (response) {
                response.forEach(element => {
                    element.contador = 0
                });
                if (response?.length > 3) {
                    navigation.navigate('ListadoVehiculo')
                } else {
                    navigation.navigate('Contador')
                }
            }
        } else {
            setLevantamientoErrors('Debe ingresar un código de levantamiento')
        }
        setLoading(false)
    }

    useEffect(() => {
        obtenerContadores()
    }, [])

    const Item = ({ data }) => (
        <TouchableOpacity
            style={[styles.item, { justifyContent: 'flex-start', padding: 8, height: 120 }]}
            activeOpacity={0.4}
            onPress={() => unirseLevantamiento(data.codigo)}
        >
            <View style={{ width: '10%' }}>
                <Icon name='car-3-plus' type='material-community' />
            </View>
            <View style={{ alignItems: 'flex-start', width: '60%' }}>
                <Text style={[styles.textBlack, { textAlign: 'left' }]}>{truncateText(data.nombre_via, 50)}</Text>
                <Text style={[styles.textBlack, { textAlign: 'left', fontSize: 16 }]}>Identificación: {data.identificacion_via}</Text>
                <Text style={[styles.textBlack, { textAlign: 'left', fontSize: 16 }]}>Categoría: {data.categoria_via}</Text>
            </View>
            <View style={{ width: '30%' }}>
                <Text style={[styles.textBlack, { textAlign: 'right', fontSize: 14, }]}>Finaliza: {data.periodo_fin}</Text>
                <Text style={[styles.textBlack, { textAlign: 'right', fontSize: 14, }]}>Código: {data.codigo}</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <Text style={styles.titleBlack}>Mis Contadores</Text>
                {
                    loading ?
                        <ActivityIndicator size="large" color={primary} />
                        :
                        <FlatList
                            data={misContadores}
                            renderItem={({ item, index }) => <Item data={item} index={index} />}
                            keyExtractor={item => item.id}
                        />
                }

            </View>
        </View>
    )
}

