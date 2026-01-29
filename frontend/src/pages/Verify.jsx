import React from 'react'
import { Link } from 'react-router-dom'

const Verify = () => {
    return (
        <div className='relative w-full h-[760] overflow-hidden'>
            <div className='min-h-screen flex items-center justify-center bg-pink-100 px-4'>
                <div className=' bg-white p-8 rounded-2xl shadow-lg ww-full max-w-md text-center' >
                    <h2 className='text-2xl font-semibold text-green-500 mb-4'>✅ Check Your Email !</h2>
                    <p className='text-green-400 text-sm'>
                        We’ve sent you an email to verify your account. Please check your inbox and click the verification link.
                    </p>
                    <p className="text-sm text-gray-600 py-1.5">
                        Didn’t receive the email?{" "}
                        <Link to="/reverify" className="text-pink-700 hover:underline">
                            Resend verification
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Verify