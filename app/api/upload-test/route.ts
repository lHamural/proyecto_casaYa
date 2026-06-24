// app/api/upload-simple/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('🎯🎯🎯 ENDPOINT SIMPLE ALCANZADO 🎯🎯🎯')
  
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    console.log('Archivo recibido:', file ? 'SÍ' : 'NO')
    console.log('Nombre del archivo:', file ? (file as File).name : 'N/A')
    console.log('Tamaño:', file ? (file as File).size : 'N/A')
    console.log('Tipo:', file ? (file as File).type : 'N/A')
    
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      fileName: (file as File).name,
      fileSize: (file as File).size,
      fileType: (file as File).type
    })
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}