import { Button } from '@rneui/base';
import React from 'react'
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { primary } from '../styles/style';
import { CatalogoComponent } from './CatalogoComponent';
import { Loading } from './Loading';

export const ModalComponent = ({ modalVisible, setModalVisible, data, setItem }) => {

    if (!data) return <Loading />

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>Reportar</Text>

                        <CatalogoComponent
                            cambiarItem={setItem}
                            catalogo={data}
                        />
                        <Button
                            title="Cerrar"
                            onPress={() => setModalVisible(!modalVisible)}
                            radius="lg"
                        />
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        color: 'white',
        marginBottom: 15,
        textAlign: 'center',
    },
});