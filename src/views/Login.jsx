import { Button } from '@rneui/base'
import React, { useState } from 'react'
import {Image, Text, TextInput, View } from 'react-native'
import { http_axios } from '../config/axios'
import { styles } from '../styles/style'

export const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const iniciarSesion = async() => {

    try {
      const params = {
        email,
        password
      }
      const response = await http_axios('/api/sanctum/token', params)
      console.log("🚀 ~ file: Login.jsx:20 ~ iniciarSesion ~ response", response)
      
    } catch (error) {
        console.log("🚀 ~ file: Login.jsx:24 ~ iniciarSesion ~ error", error)
        
    }
  }


  return (
    <View style={styles.container}>
      <View style={{ ...styles.body, flex: 4 }}>
        <Image
          style={{ ...styles.image, width: '80%', height: '80%' }}
          source={require('../img/login.png')} />
        <Text style={styles.titleText}>Iniciar sesión</Text>
      </View>
      <View style={{ ...styles.foobar, flex: 2 }} >

        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          inputMode="email"
          textAlign='center'
          style={styles.input}
        />
        <TextInput
          onChangeText={setPassword}
          value={password}
          style={styles.input}
          textAlign='center'
          placeholder="Contraseña"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          secureTextEntry
          enablesReturnKeyAutomatically
        />

        <Button
          title="Iniciar sesión"
          onPress={iniciarSesion}
          buttonStyle={{
            backgroundColor: 'rgb(100, 33, 92)',
            borderRadius: 3,
          }}
          radius="lg"
          containerStyle={{
            width: '80%',
            marginHorizontal: 50,
            marginVertical: 10,
          }}
        />
      </View>
    </View>
  )
}
