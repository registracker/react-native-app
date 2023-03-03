import { Button, Icon } from '@rneui/base';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { primary, styles } from '../styles/style';
import { Loading } from './Loading';

export const ModalComponent = ({ modalVisible, setModalVisible, data, setItem }) => {
    
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => setItem(item)}
                style={styles.roundButtonCatalogos}
            >
                <Icon
                    name={item.icono}
                    type='material-community'
                    color={primary}
                    reverse
                />
                <Text style={{ fontSize: 14, color: 'black', marginLeft: 10 }}>
                    {item.nombre}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>Reportar</Text>

                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
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

