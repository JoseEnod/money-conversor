import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import LottieView from 'lottie-react-native';

import Picker from './src/components/Picker';
import api from './src/services/api';
import coin3d from './src/assets/animations/coin-3d.json';

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [currencyBValue, setCurrencyBValue] = useState(0);

  const [initialCurrencyValue, setInitialCurrencyValue] = useState(null);
  const [convertedCurrencyValue, setConvertedCurrencyValue] = useState(0);

  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();

    async function loadMoedas() {
      const response = await api.get('all');

      let arrayCurrencies = [];
      Object.keys(response.data).map((key) => {
        arrayCurrencies.push({
          key: key,
          label: key,
          value: key
        })
      })
      setCurrencies(arrayCurrencies);
      setLoading(false);
    }

    loadMoedas();
  }, []);

  async function convert() {
    if (selectedCurrency === null || currencyBValue === 0) {
      alert('Selecione uma moeda e digite o valor!');
      return;
    }

    const response = await api.get(`all/${selectedCurrency}-BRL`);

    let result =
      (response.data[selectedCurrency].ask * parseFloat(currencyBValue));

    setConvertedCurrencyValue(`R$ ${result.toFixed(2)}`);
    setInitialCurrencyValue(currencyBValue);

    animation.current?.stop();
    Keyboard.dismiss();
  }

  function clear() {
    setConvertedCurrencyValue(0);
    setCurrencyBValue(0);
    setInitialCurrencyValue(0);

    animation.current?.play();
  }

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator
          color='#000'
          size={45}
        />
      </View>
    )
  }
  else {
    return (
      <View style={styles.container}>
        <View style={styles.coinArea}>
          <Text style={styles.title}>
            Selecione sua moeda
          </Text>
          <Picker
            currencies={currencies}
            onChange={(value) => setSelectedCurrency(value)}
          />
        </View>

        <View style={styles.valueArea}>
          <Text style={styles.title}>
            Digite um valor para converter em ( R$ )
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 130"
            keyboardType='numeric'
            onChangeText={(value) => setCurrencyBValue(value)}
            value={currencyBValue !== 0 ? `${currencyBValue}` : ''}
          />
        </View>

        <TouchableOpacity style={styles.buttonArea} onPress={convert}>
          <Text style={styles.textButton}>Converter</Text>
        </TouchableOpacity>

        {convertedCurrencyValue !== 0 ?
          (
            <>
              <View style={styles.resultArea}>
                <Text style={styles.convertedValue}>
                  {initialCurrencyValue} USD
                </Text>
                <Text style={
                  [styles.convertedValue, { fontSize: 18, margin: 5 }]
                }>
                  Corresponde a
                </Text>
                <Text style={styles.convertedValue}>
                  {convertedCurrencyValue}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.buttonArea, , { backgroundColor: '#357C3C' }]}
                onPress={clear}
              >
                <Text style={styles.textButton}>Novo valor</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.animationArea}>
              <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 300,
                  height: 300,
                  backgroundColor: '#f2f2f2',
                }}
                source={coin3d}
              />
            </View>
          )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    paddingTop: 60,
  },
  coinArea: {
    width: '90%',
    height: 90,
    backgroundColor: '#FFF',
    paddingTop: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 1,
    elevation: 3,
    padding: 5,
  },
  title: {
    fontSize: 15,
    color: '#000',
  },
  valueArea: {
    width: '90%',
    backgroundColor: '#FFF',
    paddingTop: 9,
    elevation: 3,
    paddingVertical: 9,
    padding: 5
  },
  input: {
    width: '100%',
    padding: 10,
    height: 40,
    fontSize: 18,
    marginTop: 8,
    color: '#000'
  },
  buttonArea: {
    width: '90%',
    backgroundColor: '#FFC711',
    height: 45,
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  animationArea: {
    width: '90%',
    height: 350,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultArea: {
    width: '90%',
    backgroundColor: '#FFF',
    marginTop: 35,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  convertedValue: {
    fontSize: 39,
    fontWeight: 'bold',
    color: '#000'
  }
});
