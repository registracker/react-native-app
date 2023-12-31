import { Button, Icon } from '@rneui/base';
import React, { useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { primary, styles } from '../styles/style';
import { useContext } from 'react';
import { CatalogosContext } from '../context/store/CatalogosContext';
import { IncidenteContext } from '../context/levantamiento/IncidenteContext';

export const ModalComponent = ({ modalVisible, setModalVisible, enviar }) => {

    const [selected, setSelected] = useState()
    const { ctl_incidentes } = useContext(CatalogosContext)
    const { enviarIncidente } = useContext(IncidenteContext)

    const reportarIncidente = async () => {
        setModalVisible(!modalVisible)
        setSelected()
        await enviarIncidente(selected);
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{
                alignItems: 'center',
            }}>
                <TouchableOpacity
                    onPress={() => setSelected(item)}
                    style={selected?.id === item.id ? styles.iconoSelected : styles.iconos}
                >
                    <Icon
                        name={item.icono}
                        type='material-community'
                        color={selected?.id === item.id ? primary : 'grey'}
                        reverseColor={primary}
                        solid
                        size={selected?.id === item.id ? 50 : 40}
                    />

                </TouchableOpacity>
                <View style={{width: 80}}>
                    <Text style={styles.modalText}>
                        {item.nombre}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView} >
                <View style={styles.modalView}>
                    <Icon
                        color="white"
                        name="close"
                        reverseColor="black"
                        type="material-community"

                    />

                    <View style={styles.card}>

                        <Text style={styles.modalTextTitle}>Reportar incidente</Text>
                        <Text style={styles.modalTextSubtitle}>Los incidentes vehiculares son eventos que involucran vehículos y pueden tener distintas causas, puedes reportarlos en cualquier momento. </Text>
                    </View>
                    <FlatList
                        data={ctl_incidentes.data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns='3'
                    />
                    <Button
                        title="Reportar"
                        onPress={() => reportarIncidente()}
                        radius="lg"
                        disabled={!selected}
                        buttonStyle={styles.buttonPrimary}
                        containerStyle={styles.buttonContainer}
                    />
                </View>
            </View>
        </Modal>
    )
}
