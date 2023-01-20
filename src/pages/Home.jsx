import React from 'react'
import { Text, View } from 'react-native'
import { Toolbar } from '../navigation/Toolbar'
import { MapPage } from './MapPage'

export const Home = () => {
    return (
           <View>
            <Toolbar></Toolbar>
            <MapPage></MapPage>
           </View>
    )
}
