import { Button, Icon } from '@rneui/base';
import React, { useEffect, useState } from 'react'
import {  Modal, StyleSheet, Text, View } from 'react-native'
import { primary, styles } from '../styles/style';
import { Input } from '@rneui/themed';
import { MarcadorContext } from '../context/levantamiento/MarcadorContext'

// Import services
import { useContext } from 'react';
import { NavigationContext } from '@react-navigation/native';

export const MarcadorModalComponent = ({ open, setOpen }) => {
    const [levantamiento, setLevantamiento] = useState("89a1-a23a-210a")
    const [levantamientoErrors, setLevantamientoErrors] = useState("")
    const [cargando, setCargando] = useState(false)


    const navigation = useContext(NavigationContext)
    const { guardar, verificar, valido, levantamiento: levantamientoActivo, restablecer } = useContext(MarcadorContext)

    const unirseLevantamiento = async () => {
        setCargando(true)
        if(levantamiento){

            const continuar = await guardar(levantamiento);
            if (continuar) {
                setOpen(!open)
                navigation.navigate('Marcador')
            }
        } else {
            setLevantamientoErrors('Debe ingresar un código de levantamiento')
        }
        setCargando(false)
    }

    useEffect(() => {
        verificar();
    }, [])


    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={open}
                onRequestClose={() => {
                    setOpen(!open);
                }}
            >
                <View style={stylesMarcador.centeredView}>
                    <View style={stylesMarcador.modalView}>
                        <Text style={styles.textBlack}>El código de levantamiento sera proporcionado por el usuario investigador</Text>
                        {
                            valido ?
                                <>
                                    <Text style={styles.textBlack}>Actualmente tiene un código activo de levantamiento</Text>
                                    <View style={{ backgroundColor: primary, justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5 }}>
                                        <Text style={styles.text}>Código:{levantamientoActivo.codigo}</Text>
                                    </View>
                                </> :
                                <Input
                                    onChangeText={setLevantamiento}
                                    value={levantamiento}
                                    autoCapitalize='none'
                                    placeholder={levantamientoErrors ? levantamientoErrors : "XXXX-XXXX-XXXX"}
                                    inputMode="text"
                                    textAlign='center'
                                    style={{ ...styles.input, color: 'black' }}
                                    // onBlur={() => isEmail()}
                                    errorMessage={levantamientoErrors}
                                    leftIcon={levantamientoErrors ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                                    errorStyle={levantamientoErrors ? styles.errorStyle : null}
                                    label="Código de levantamiento"
                                    labelStyle={{ color: 'grey' }}
                                    inputContainerStyle={setLevantamientoErrors ? styles.inputContainerError : styles.inputContainer}
                                    onFocus={() => { setLevantamientoErrors("") }}
                                />
                        }
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <Button
                                title={valido ? 'Restablecer' : 'Omitir'}
                                type="clear"
                                titleStyle={{ color: 'gray' }}
                                onPress={() => { valido ? restablecer() : setOpen(!open) }}
                            />
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
                </View >
            </Modal>
        </View>
    )
}

const stylesMarcador = StyleSheet.create({
    head: {
        flex: 0.1,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    footer: {
        flex: 0.3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',

    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});