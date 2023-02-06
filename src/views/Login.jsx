import axios from 'axios'
import React, { useState } from 'react'
import { Alert, Button, TextInput, View } from 'react-native'
import { http_axios } from '../config/axios'

export const Login = () => {

    const [email, setEmail] = useState('')
    const [clave, setClave] = useState('')
    
    const iniciarSesion = async () => {

      const params = { 
        email,
        clave
      }
      

      // const response  =  await http_axios('api/sanctum/token',  params, 'get')
      console.log("🚀 ~ file: Login.jsx:20 ~ iniciarSesion ~ response", params)


    }


  return (
    <View>
          <TextInput
              // style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              inputMode="email"
          />
          <TextInput
              // style={styles.input}
              onChangeText={setClave}
              value={clave}
              placeholder="Contraseña"
              keyboardType="visible-password"
              textContentType="password"
          />

          <Button
              title="Press me"
        onPress={iniciarSesion}
          />
    </View>
  )
}
