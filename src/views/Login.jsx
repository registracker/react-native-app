import React, { useState } from 'react'
import { Button, TextInput, View } from 'react-native'

export const Login = () => {

    const [email, setEmail] = useState('')
    const [clave, setClave] = useState('')



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
              onPress={() => Alert.alert('Simple Button pressed')}
          />
    </View>
  )
}
