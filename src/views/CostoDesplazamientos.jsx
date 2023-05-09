import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useContext } from 'react'

import { DesplazamientoContext } from '../context/tracking/DesplazamientoContext'
import { FlatList } from 'react-native-gesture-handler'
import { Icon } from '@rneui/base'

import { primary } from '../styles/style';


const CostoDesplazamientos = () => {

    const { listMedios } = useContext(DesplazamientoContext)


    const Item = ({ data }) => (
        <View style={styles.item}>
            <View style={styles.elements}>
                <Icon name={data.icono} type='material-community' size={25} color="gray" />
                <Text style={styles.title}>{data.nombre}</Text>
            </View>
            <View style={styles.elements}>
                <Icon name='arrow-up-drop-circle' type='material-community' size={25} color={primary} />
                <Text style={styles.title}>$ {data.costo}</Text>
                <Icon name='arrow-down-drop-circle' type='material-community' size={25} color={primary} />
            </View>
        </View>
    );

    return (
        <View>
            <Text>CostoDesplazamientos</Text>
            <Text>{JSON.stringify(listMedios)}</Text>
            <FlatList
                data={listMedios}
                renderItem={({ item }) => <Item data={item} />}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default CostoDesplazamientos

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#e1e1e1',
        padding: 15,
        marginVertical: 2,
        marginHorizontal: 4,
        justifyContent: 'space-between',
        borderRadius: 5
    },
    elements: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        marginHorizontal: 10
    },
});