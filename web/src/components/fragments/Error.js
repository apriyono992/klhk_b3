import { Button } from '@nextui-org/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Error({ code, header, message }) {
  const navigate = useNavigate()
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
        <div className="text-center">
            <h1 className="text-9xl font-black text-gray-200">{code}</h1>
            <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl capitalize">{header}</p>
            <p className="mt-2 mb-6 text-gray-500">{message}</p>
            <Button onPress={() => navigate(-1, { replace: true })} radius='none' color='primary'>
                Kembali
            </Button>
        </div>
    </div>
  )
}