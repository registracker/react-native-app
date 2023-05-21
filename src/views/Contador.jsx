import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { primary, styles } from '../styles/style'
import { Button, Icon, Input } from '@rneui/base'
import { ContadorContext } from '../context/levantamiento/ContadorContext'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { CatalogosContext } from '../context/store/CatalogosContext'

const Contador = ({ navigation }) => {

    const [levantamiento, setLevantamiento] = useState("dfd2-2359-57ff")
    const [levantamientoErrors, setLevantamientoErrors] = useState()
    const [cargando, setCargando] = useState(false)

    const {
        contador,
        guardar,
        verificar,
        activo,
        levantamiento: levantamientoActivo,
        sumar,
        restar,
        enviar
    } = useContext(ContadorContext)

    const unirseLevantamiento = async () => {
        setCargando(true)
        if (levantamiento) {

            const continuar = await guardar(levantamiento);
            if (continuar) {
                console.log("object");

            }
        } else {
            setLevantamientoErrors('Debe ingresar un código de levantamiento')
        }
        setCargando(false)
    }

    useEffect(() => {
        verificar()
    }, [])

    useEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <>
                    {
                        activo &&
                        <TouchableOpacity onPress={() => { enviar() }} style={{ width: 80, alignItems: 'center', flexDirection: 'row', marginRight: 10 }}>
                            <Text style={styles.text}> Cerrar </Text>
                            <Icon
                                name='chain-broken'
                                type='font-awesome'
                                color='white'
                                suppressHighlighting={true}
                            />
                        </TouchableOpacity>
                    }
                </>
            ),
        });
    }, [activo])


    const Item = ({ data, index }) => (
        <View style={{ width: '100%', marginBottom: 20 }} >
            <Text style={{ ...styles.text, borderWidth: 2, borderColor: 'white', padding: 5, backgroundColor: '#474747', borderRadius: 5 }}>{data.nombre}</Text>
            <View style={{ flexDirection: 'row', width: '100%', padding: 5, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ width: '40%', height: '100%', margin: 5, borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => restar(index)}
                    activeOpacity={0}
                >
                    <Icon type='material-community' name='minus-thick' color={primary} />
                </TouchableOpacity>
                <View
                    style={{ width: '20%', height: '100%', margin: 5, borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text style={styles.textBlack}>{data.contador}</Text>
                </View>
                <TouchableOpacity
                    style={{ width: '40%', height: '100%', margin: 5, borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => sumar(index)}
                    delayPressIn={0}
                    activeOpacity={0}
                >
                    <Icon type='ionicons' name='add' color={primary} />
                </TouchableOpacity>
            </View>
        </View>

    );

    const EmptyList = () => (
        <Text color='black' style={styles.textBlack}>NO HAY DATOS</Text>
    )

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../img/fondo.png')}
                resizeMode="cover"
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    tintColor: 'transparent'
                }}
            >
                <View style={styles.body}>
                    {
                        activo ?
                            <View style={{ width: '100%', borderRadius: 5, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={styles.chip}>Conteo vehicular - código: {levantamientoActivo.codigo}</Text>
                                <FlatList
                                    data={contador}
                                    renderItem={({ item, index }) => <Item data={item} index={index} />}
                                    keyExtractor={item => item.id}
                                    style={{ width: '100%' }}
                                    ListEmptyComponent={<EmptyList />}
                                />
                            </View> :
                            <View style={styles.modalView}>
                                <Text style={styles.chip}>Contador</Text>
                                <Text style={styles.textBlack}>Código de levantamiento</Text>
                                <Input
                                    onChangeText={setLevantamiento}
                                    value={levantamiento}
                                    autoCapitalize='none'
                                    placeholder={levantamientoErrors ? levantamientoErrors : "XXXX-XXXX-XXXX"}
                                    inputMode="text"
                                    textAlign='center'
                                    style={{ ...styles.input, color: 'black' }}
                                    errorMessage={levantamientoErrors}
                                    leftIcon={levantamientoErrors ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                                    errorStyle={levantamientoErrors ? styles.errorStyle : null}
                                    inputContainerStyle={setLevantamientoErrors ? styles.inputContainerError : styles.inputContainer}
                                    onFocus={() => { setLevantamientoErrors("") }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <Button
                                        title='Unirse'
                                        onPress={unirseLevantamiento}
                                        disabledStyle={styles.buttonPrimaryDisabled}
                                        loading={cargando}
                                        type="clear"
                                        titleStyle={{ color: primary }}
                                    />
                                </View>
                            </View>
                    }
                </View>
            </ImageBackground >
        </View >
    )
}

export default Contador
