import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { primary, styles } from '../styles/style';
import { Button } from '@rneui/base';
import { NavigationContext } from '@react-navigation/native';
import { useContext } from 'react';
import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext';


export default CostoDesplazamientoModalComponent = ({ open, setOpen }) => {

    const navigation = useContext(NavigationContext)
    const { enviarDesplazamiento } = useContext(DesplazamientoContext)

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                visible={open}
                onRequestClose={() => {
                    enviarDesplazamiento()
                    setOpen(!open);
                }}>
                <View style={costoStyles.centeredView}>
                    <View style={costoStyles.modalView}>
                        <Text style={styles.textBlack}>¿Deseas agregar la el costo del desplazamientos?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Button title="Omitir" type="clear" titleStyle={{ color: 'gray' }} onPress={() => { enviarDesplazamiento(); setOpen(!open); }} />
                            <Button title="Sí, seguro" type="clear" titleStyle={{ color: primary }} onPress={() => {
                                navigation.navigate('CostosDesplazamiento')
                                setOpen(!open)
                            }} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}


const costoStyles = StyleSheet.create({
    head: {
        flex: 0.1,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    // input: {
    //   height: 40,
    //   width: '20%',
    //   paddingBottom: 8,
    //   color: 'white',
    // },
});