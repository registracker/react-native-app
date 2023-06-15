import { View, Text, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { getMisMarcadores } from '../../services/marcadorServices'
import { useEffect } from 'react'
import { useContext } from 'react'
import { primary, styles } from '../../styles/style'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, Icon, Image } from '@rneui/base'
import { format } from 'date-fns'
import { ActivityIndicator } from 'react-native'
import { showToast } from '../../utils/toast'
import { MarcadorContext } from '../../context/levantamiento/MarcadorContext'

export const MisMarcadores = ({ navigation }) => {

    const { getUltimoMarcador, guardar } = useContext(MarcadorContext)

    const [misContadores, setMisContadores] = useState([])
    const [loading, setLoading] = useState(false)
    const [marcador, setMarcador] = useState()

    const obtenerMarcadores = async () => {
        setLoading(true)
        const marcador = await getUltimoMarcador()
        const { data } = await getMisMarcadores()
        setMisContadores(data)
        if (marcador) {
            setMarcador(marcador)
            navigation.navigate('Marcador')
        }
        setLoading(false)
    }

    const actualizarMisMarcadores = async () => {
        const { data } = await getMisMarcadores()
        setMisContadores(data)
    }

    const unirseLevantamiento = async (levantamiento) => {
        setLoading(true)
        if (levantamiento) {
            const response = await guardar(levantamiento);
            if (response) {
                navigation.navigate('Marcador')
            }
        } else {
            setLevantamientoErrors('Debe ingresar un código de levantamiento')
        }
        setLoading(false)
    }

    useEffect(() => {
        obtenerMarcadores()
    }, [])

    const Item = ({ data }) => (
        <TouchableOpacity
            style={[styles.item, { justifyContent: 'flex-start', padding: 8, height: 80 }]}
            activeOpacity={0.4}
            onPress={() => unirseLevantamiento(data.codigo)}
        >
            <View style={{ width: '10%' }}>
                <Icon name='traffic-light' type='material-community' />
            </View>
            <View style={{ alignItems: 'flex-start', width: '60%' }}>
                <Text style={[styles.textBlack, { textAlign: 'left' }]}>Código: {data.codigo}</Text>
                <Text style={[styles.textBlack, { textAlign: 'left', fontSize: 14 }]}>Creado: {format(new Date(data.fecha_creado), "yyyy-MM-dd hh:mm:ss aaaa")}</Text>
            </View>
            <View style={{ width: '30%' }}>
                <Text style={[styles.textBlack, { textAlign: 'right', fontSize: 14, }]}>Finaliza: {data.fecha_vencimiento}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../img/fondo.png')} resizeMode="cover" style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <View style={[styles.body, styles.center]}>
                    {
                        loading ?
                            <ActivityIndicator size="large" color={primary} />
                            :
                            <FlatList
                                data={misContadores}
                                renderItem={({ item, index }) => <Item data={item} index={index} />}
                                keyExtractor={item => item.id}
                                ListEmptyComponent={
                                    <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent:'center' }}>
                                        <Text style={styles.title}>
                                            Sin datos o registros encontrados...
                                        </Text>
                                        <Image
                                            style={[styles.image, { width: 200, height: 200 }]}
                                            source={require('../../img/pin.png')}
                                        />
                                        {
                                            marcador &&
                                            <View style={{ marginTop: 10 }}>
                                                <Text
                                                    style={styles.chip}
                                                    onPress={() => navigation.navigate('Marcador')}
                                                >
                                                    Continuar con código {marcador?.codigo}
                                                </Text>

                                            </View>
                                        }
                                    </View>
                                }
                                onRefresh={actualizarMisMarcadores}
                                refreshing={loading}
                            />
                    }
                </View>
            </ImageBackground>

        </View>
    )
}

