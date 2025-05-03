import React, { useState } from 'react'
import { Alert, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
          full_name: fullName,
        }
      }
    })

    if (error) {
      Alert.alert(error.message)
    } else if (!session) {
      // After signing up, insert the user data into your custom table
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: (await supabase.auth.getUser()).data.user?.id,
              username: username,
              full_name: fullName,
              updated_at: new Date(),
            }
          ])
        
        if (profileError) throw profileError
        Alert.alert('Please check your inbox for email verification!')
      } catch (err: any) {
        Alert.alert('Error creating profile: ' + err.message)
      }
    }
    
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ASHA Mitra</Text>
      <Text style={styles.subtitle}>{isLogin ? 'Login' : 'Sign Up'}</Text>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>

      {!isLogin && (
        <>
          <View style={styles.verticallySpaced}>
            <Input
              label="Username"
              leftIcon={{ type: 'font-awesome', name: 'user' }}
              onChangeText={(text) => setUsername(text)}
              value={username}
              placeholder="username"
              autoCapitalize={'none'}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Input
              label="Full Name"
              leftIcon={{ type: 'font-awesome', name: 'user' }}
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              placeholder="Full Name"
            />
          </View>
        </>
      )}

      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button 
          title={isLogin ? "Sign in" : "Sign up"} 
          disabled={loading} 
          onPress={() => isLogin ? signInWithEmail() : signUpWithEmail()} 
        />
      </View>

      <View style={styles.switchContainer}>
        <Text>{isLogin ? "Don't have an account? " : "Already have an account? "}</Text>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>{isLogin ? "Sign up" : "Sign in"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#89CFF0',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchText: {
    color: '#89CFF0',
    fontWeight: 'bold',
  },
})
