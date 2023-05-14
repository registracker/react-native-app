import { ActivityIndicator, Alert, BackHandler, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { primary, styles } from '../styles/style';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Icon } from '@rneui/base';
import { Input } from '@rneui/themed';

import { postBuscarRutasTransporteInstance } from '../services/rutasTransporteService'
import { color } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';

import { useBackHandler } from '@react-native-community/hooks'
import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext';

const ListadoRutaTransporte = ({ navigation }) => {

    const [ruta, setRuta] = useState()
    const [rutaErrors, setRutaErrors] = useState()

    const [resultado, setResultado] = useState()
    const [siguiente, setSiguiente] = useState()
    const [loading, setLoading] = useState(false)

    const [seleted, setSeleted] = useState()

    const { actualizarMedioDesplazamiento } = useContext(DesplazamientoContext)

    const seleccionarRuta = (item) => {
        setSeleted(item)
        actualizarMedioDesplazamiento(item)
    }

    const buscar = async () => {
        setLoading(true)
        if (!ruta) {
            setRutaErrors('Campo de busqueda esta vacio')
            setLoading(false)
            return;
        }
        const page = siguiente ? siguiente.split('?')[1] : null
        if (page) {

            const { data, links } = await postBuscarRutasTransporteInstance(ruta, page)
            if (data) setResultado([...resultado, ...data])
            setSiguiente(links?.next)
        } else {
            const { data, links } = await postBuscarRutasTransporteInstance(ruta)
            if (data) setResultado(data)
            setSiguiente(links?.next)
        }
        setLoading(false)
    }

    const buscarSiguiente = async () => {
        if (siguiente == null || siguiente === undefined) {
            return;
        }
        await buscar();
    }

    const Item = ({ data, index }) => (
        <TouchableOpacity
            style={seleted?.id === data.id ? stylesRegistro.seleted : stylesRegistro.item}
            onPress={() => seleccionarRuta(data)}
            activeOpacity={0.4}
        >
            <View style={stylesRegistro.elements}>
                <Icon name='bus' type='material-community' size={25} color={seleted?.id === data.id ? primary : 'grey'} />
                <View>
                    <Text style={stylesRegistro.title}>Ruta:{data.ruta}</Text>
                    <Text style={stylesRegistro.title}>{data.codigo_ruta}</Text>
                </View>
            </View>
            <View style={stylesRegistro.elements}>
                <Text
                    style={stylesRegistro.title}
                >$ {parseFloat(data.tarifa_autorizada, 10).toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    const EmptyList = () => (
        <Text color='black' style={{ textAlign: 'center' }}>NO HAY DATOS</Text>
    )
    const ListEndLoader = () => {
        if (loading) {
            return <ActivityIndicator size={'large'} color={primary} />;
        }
    };

    return (
        <View style={{
            flex: 1,
            justifyContent: 'space-around',
            alignContent: 'center',
            width: '100%',
        }}>

            <View style={styles.body}>
                <View style={{ justifyContent: 'center', marginHorizontal: 10, width: '100%' }}>

                    <Input
                        onChangeText={setRuta}
                        value={ruta}
                        autoCapitalize='none'
                        placeholder={rutaErrors ? rutaErrors : "Buscar por ruta, código o departamento"}
                        inputMode="text"
                        textAlign='center'
                        label='Búsqueda'
                        style={{ ...styles.input, color: 'black' }}
                        errorMessage={rutaErrors}
                        leftIcon={rutaErrors ? <Icon name="information-outline" type='material-community' size={20} color={primary} /> : ''}
                        errorStyle={rutaErrors ? stylesRegistro.errorStyle : null}
                        labelStyle={{ color: 'grey' }}
                        inputContainerStyle={setRutaErrors ? styles.inputContainerError : styles.inputContainer}
                        onFocus={() => { setRutaErrors("") }}
                    />

                    <FlatList
                        data={resultado}
                        renderItem={({ item, index }) => <Item data={item} index={index} />}
                        keyExtractor={item => item.id}
                        onEndReached={buscarSiguiente}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={ListEndLoader}
                        ListEmptyComponent={<EmptyList />}
                    />
                </View>
            </View>
            <View>
                <Button
                    title='Buscar'
                    buttonStyle={styles.buttonSearch}
                    onPress={() => buscar()}
                    disabled={loading}
                />
                <Button
                    title={seleted ? 'Guardar' : 'Omitir'}
                    buttonStyle={seleted ? styles.buttonPrimary : styles.buttonSecondary}
                    onPress={() => navigation.navigate('TabNavegacion')}
                />
            </View>
        </View>
    )
}

export default ListadoRutaTransporte


const stylesRegistro = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        alignContent: 'space-between',
    },
    body: {
        flex: 1,
        justifyContent: 'space-around',
        alignContent: 'center',
        width: '100%',
    },
    item: {
        backgroundColor: '#e1e1e1',
        padding: 15,
        marginVertical: 2,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    elements: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        marginHorizontal: 10,
    },
    button: {
        marginHorizontal: 10,
        marginVertical: 3,
        borderRadius: 5,
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        minHeight: '30%',
        padding: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    seleted: {
        backgroundColor: '#e1e1e1',
        padding: 15,
        marginVertical: 2,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: primary,
        borderWidth: 2
    }
});