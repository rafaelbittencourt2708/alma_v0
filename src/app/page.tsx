import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Clinic Assistant</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your intelligent platform for managing medical practices efficiently
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Patient Management</h2>
            <p className="text-gray-700">Streamline patient records and scheduling</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">AI Assistant</h2>
            <p className="text-gray-700">Intelligent support for medical workflows</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Secure Communication</h2>
            <p className="text-gray-700">HIPAA-compliant messaging and consultations</p>
          </div>
        </div>
        <div className="mt-10">
          <a 
            href="/dashboard" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  )
}
