import React, { useEffect, useState, createRef } from 'react';
import {
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
} from 'react-native';
import { primary, styles } from '../styles/style';
import { Button, CheckBox, Icon } from '@rneui/base';
import { Input } from '@rneui/themed';
import { register } from '../services/aurtenticacionServices';

export const FormularioRegistro = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState();
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
    useState();
  const [emailErrorMessage, setEmailErrorMessage] = useState();
  const [formInvalid, setFormInvalid] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [rol, setRol] = useState({ id: 2 });
  const [selectionRol, setSelectionRol] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const toggleCheckbox = () => setChecked(!checked);
  const [modalVisible, setModalVisible] = useState(false);

  const inputPassword = createRef();
  const inputPasswordConfirm = createRef();
  const inputEmail = createRef();

  const investigador = { type: 'investigador', id: 3 };
  const participante = { type: 'participante', id: 2 };

  const registrar = async () => {
    const data = {
      email,
      password,
      rol: rol.id,
    };

    try {
      setCargando(true);
      if (comparePassword()) {
        const { usuario, estado_cuenta } = await register(null, data);
        if (estado_cuenta === 'En revisión') {
          ToastAndroid.showWithGravity(
            'Cuenta con estado de revisión',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        } else if (estado_cuenta === 'Activa') {
          ToastAndroid.showWithGravity(
            'Cuenta creada con exito',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
        navigation.navigate('Login');
      } else {
        inputPassword.current.focus();
        inputPassword.current.clear();
        inputPasswordConfirm.current.clear();
      }
    } catch (error) {

      ToastAndroid.showWithGravity(
        `${error.data.message}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setCargando(false);
      cleanForm();
    }
  };

  const comparePassword = () => {
    if (password === passwordConfirm) {
      return true;
    } else {
      ToastAndroid.showWithGravity(
        'La contraseña no coinciden',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return false;
    }
  };

  const isEmail = () => {
    if (email) {
      const validRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!email.match(validRegex)) {
        setEmailErrorMessage('Ingrese un correo electrónico valido');
        return false;
      } else {
        setEmailErrorMessage();
        return true;
      }
    }
  };

  const selectRol = () => {
    if (rol) return true;
    setSelectionRol(true);
    return false;
  };

  /* 
    ^                         Start anchor
    (?=.*[A-Z])               Ensure string has one uppercase letters.
    (?=.*[!@#$&*])            Ensure string has one special case letter.
    (?=.*[0-9])               Ensure string has one digits.
    (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
    .{8,}                      Ensure string is of length 8. Para cualquiera que quiera una longitud de al menos
    $                         End anchor.
    */
  const isPasswordSecure = () => {
    if (password) {

      const validRegex =
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
      if (!password.match(validRegex)) {
        setFormInvalid(true);
        setPasswordErrorMessage('La contraseña debe tener mínimo una letra mayúscula, tres minúscula, un carácter especial, un dígito y mínimo ocho caracteres');
      } else {
        setPasswordErrorMessage();
      }
    }
  };

  const cleanForm = () => {
    setPassword(null);
    setPasswordConfirm(null);
    setRol()
  };

  const matchPassword = () => {
    if (password !== passwordConfirm && passwordConfirm) {
      setPasswordErrorMessage('Las contraseña no coinciden');
      setPasswordConfirmErrorMessage('Las contraseña no coinciden');
      setFormInvalid(true);
    }
  }

  useEffect(() => {

    if (!email && password && passwordConfirm) {
      setEmailErrorMessage('Ingrese un correo electrónico');
      setFormInvalid(true);
    }
    if (
      password === passwordConfirm &&
      email &&
      passwordConfirm &&
      isEmail() &&
      selectRol() 
    ) {
      setPasswordErrorMessage();
      setPasswordConfirmErrorMessage();
      setEmailErrorMessage();
      setFormInvalid(false);
    } else {
      setFormInvalid(true);
    }

  }, [passwordConfirm, password, email, rol, checked]);

  useEffect(() => {
    if (rol) setSelectionRol(false);
  }, [rol]);

  return (
      <ScrollView contentContainerStyle={styles.container}>

        <ImageBackground
          source={require('../img/loginBackground.jpg')}
          resizeMode="cover"
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <View style={styles.body}>

            <Text style={styles.title}>Registro de usuario</Text>
            <Text style={styles.text}>Elige un rol para tu usuario</Text>
            <View style={styles.row}>
              <TouchableHighlight
                style={rol.id == 2 ? styles.customButtom : styles.customButtomDisabled}
                onPress={() => setRol(participante)}>
                <View
                  style={styles.center}>
                  <Icon
                    name="map-marker-distance"
                    type="material-community"
                    size={36}
                    color="white"
                  />
                  <Text style={styles.text}>
                    Participante
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={rol.id == 3 ? styles.customButtom : styles.customButtomDisabled}
                onPress={() => setRol(investigador)}>
                <View
                  style={styles.center}>
                  <Icon
                    name="account-hard-hat"
                    type="material-community"
                    size={36}
                    color="white"
                  />
                  <Text style={styles.text}>
                    Investigador
                  </Text>
                </View>
              </TouchableHighlight>
            </View>

            <View style={styles.center} >
              <Input
                onChangeText={setEmail}
                value={email}
                autoCapitalize='none'
                label="Correo electrónico"
                placeholder="Correo electrónico"
                keyboardType="email-address"
                inputMode="email"
                textAlign="center"
                onFocus={() => { setEmailErrorMessage() }}
                style={styles.input}
                inputContainerStyle={emailErrorMessage ? styles.inputContainerError : styles.inputContainer}
                leftIcon={emailErrorMessage ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                ref={inputEmail}
                errorMessage={emailErrorMessage}
                onBlur={() => isEmail()}
                labelStyle={{ marginTop: 10, color: 'white' }}
                errorStyle={emailErrorMessage ? stylesRegistro.errorStyle : null}
              />
              <Input
                onChangeText={setPassword}
                onFocus={() => { setPasswordErrorMessage() }}

                value={password}
                style={styles.input}
                label="Contraseña"
                labelStyle={{ marginTop: 10, color: 'white' }}
                textAlign="center"
                placeholder="**********"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                secureTextEntry
                enablesReturnKeyAutomatically
                inputContainerStyle={passwordErrorMessage ? styles.inputContainerError : styles.inputContainer}
                leftIcon={passwordErrorMessage ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                errorMessage={passwordErrorMessage}
                errorStyle={
                  passwordErrorMessage ? stylesRegistro.errorStyle : null
                }
                ref={inputPassword}
                onBlur={isPasswordSecure}
              />
              <Input
                onChangeText={setPasswordConfirm}
                onFocus={() => { setPasswordConfirmErrorMessage("") }}
                value={passwordConfirm}
                style={styles.input}
                label="Confirmar contraseña"
                labelStyle={{ marginTop: 10, color: 'white' }}
                textAlign="center"
                placeholder=" *********"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                secureTextEntry
                enablesReturnKeyAutomatically
                inputContainerStyle={passwordConfirmErrorMessage ? styles.inputContainerError : styles.inputContainer}
                leftIcon={passwordConfirmErrorMessage ? <Icon name="information-outline" type='material-community' size={20} color='white' /> : ''}
                errorMessage={passwordConfirmErrorMessage}
                errorStyle={
                  passwordConfirmErrorMessage ? stylesRegistro.errorStyle : null
                }
                ref={inputPasswordConfirm}
                onBlur={matchPassword}
              />
              {/* TODO: Mostrar el texto de términos y condiciones */}
              {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <CheckBox
                  checked={checked}
                  onPress={viewTerminosCondiciones}
                  onIconPress={toggleCheckbox}
                  iconType="material-community"
                  checkedIcon="checkbox-marked"
                  uncheckedIcon={'checkbox-blank-outline'}
                  checkedColor='white'
                  // title="He leído, y acepto los términos y condiciones."
                  containerStyle={{
                    borderRadius: 3,
                    backgroundColor: 'transparent',
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 14,
                    textDecorationLine: 'underline'
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  He leído, acepto los
                  términos y condiciones
                </Text>
              </View> */}
            </View>
          </View>

          <View style={styles.foobar}>
            <Button
              title="Registrarse"
              onPress={registrar}
              buttonStyle={styles.buttonPrimary}
              disabledStyle={styles.buttonPrimaryDisabled}
              loading={cargando}
              disabled={formInvalid}
              radius="lg"
              containerStyle={styles.buttonContainer}
            />
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={{
                flex: 1
              }}>
                <View style={{
                  flex: 7
                }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Términos y Condiciones</Text>
                  <Text style={{
                    fontSize: 11,
                    textAlign: 'center',
                  }}>LOREM</Text>
                </View>
                <View style={{
                  flex: 0.5
                }}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Cerrar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </ScrollView>
  );
};

const stylesRegistro = StyleSheet.create({
  errorStyle: {
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
  },

});
