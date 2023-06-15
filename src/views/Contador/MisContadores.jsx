import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { getMisContadores } from '../../services/contadorServices'
import { useEffect } from 'react'
import { useContext } from 'react'
import { ContadorContext } from '../../context/levantamiento/ContadorContext'
import { primary, styles } from '../../styles/style'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, Icon, Image } from '@rneui/base'
import { format, parseISO } from 'date-fns'
import { truncateText } from '../../utils/functions'
import { ActivityIndicator } from 'react-native'
import { showToast } from '../../utils/toast'
import { ImageBackground } from 'react-native'

export const MisContadores = ({ navigation }) => {

    const { getUltimoContador, guardar } = useContext(ContadorContext)

    const [misContadores, setMisContadores] = useState([])
    const [loading, setLoading] = useState(false)
    const [contador, setContador] = useState()

    const obtenerContadores = async () => {
        setLoading(true)
        const contador = await getUltimoContador()
        const { data } = await getMisContadores()
        setMisContadores(data)
        if (contador) {
            setContador(contador)
            navigation.navigate('Contador')
        } else {

        }
        setLoading(false)
    }

    const actualizarMisContadores = async () => {
        const { data } = await getMisContadores()
        setMisContadores(data)
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
            <ImageBackground source={require('../../img/fondo.png')} resizeMode="cover" style={{
                flex: 1,
                justifyContent: 'center',
            }}>

                <View style={styles.body}>
                    {
                        loading ?
                            <ActivityIndicator size="large" color={primary} />
                            :
                            <FlatList
                                data={misContadores}
                                renderItem={({ item, index }) => <Item data={item} index={index} />}
                                keyExtractor={item => item.id}
                                ListEmptyComponent={
                                    <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.title}>
                                            Sin datos o registros encontrados...
                                        </Text>
                                        <Image
                                            style={[styles.image, { width: 200, height: 200 }]}
                                            source={require('../../img/pin.png')}
                                        />
                                        {
                                            contador &&
                                            <View style={{ marginTop: 10 }}>
                                                <Text
                                                    style={styles.chip}
                                                    onPress={() => navigation.navigate('Contador')}
                                                >
                                                    Continuar con código {contador.codigo}
                                                </Text>
                                                
                                            </View>
                                        }

                                    </View>
                                }
                                onRefresh={actualizarMisContadores}
                                refreshing={loading}
                            />
                    }

                </View>
            </ImageBackground>

        </View>
    )
}

