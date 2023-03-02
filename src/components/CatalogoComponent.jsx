import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import { Loading } from './Loading';

import { primary, styles } from '../styles/style';
import { Icon } from '@rneui/base';


export const CatalogoComponent = ({ cambiarItem, catalogo }) => {


    return (
        <View style={{
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: 0,
        }}>
            {
                catalogo.map(item => {
                    return (
                        <View
                            key={item.id}
                            style={{
                                margin: 10,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                            <TouchableOpacity
                                onPress={() => cambiarItem(item)}
                                style={styles.roundButtonCatalogos}
                            >
                                <Icon
                                    name={item.icono}
                                    type='material-community'
                                    color={primary}
                                    reverse
                                />
                            <Text style={{ fontSize: 14 , color: 'black', marginLeft:10 }}>
                                {item.nombre}
                            </Text>
                            </TouchableOpacity>

                        </View>
                    )
                })
            }
        </View>
    )
}
