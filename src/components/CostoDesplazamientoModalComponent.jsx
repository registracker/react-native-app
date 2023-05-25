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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
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

