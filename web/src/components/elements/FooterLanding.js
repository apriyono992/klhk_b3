import React from 'react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/images/logo.png'
import facebook from '../../assets/images/facebook.png'
import instagram from '../../assets/images/instagram.svg'
import twitter from '../../assets/images/twitter.png'
import linkedin from '../../assets/images/linkedin.svg'

export default function FooterLanding() {
    return (
    <footer className="bg-gray-100 pt-8 pb-4 text-[#5D7987]">
      <div className="container mx-auto flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:items-center px-6">
        
        <div className="flex flex-col items-start space-y-8 mr-[10%]">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-10 w-10"/>
            <div>
              <h4 className="font-semibold text-base">Kementerian Lingkungan Hidup dan Kehutanan</h4>
              <p className="text-sm">REPUBLIK INDONESIA</p>
            </div>
          </div>
          <p className="text-sm">
            Jl. D.I. Panjaitan, Kebon Nanas, Jakarta 13410, Indonesia
          </p>
        </div>

        <div className='pt-9 mr-[10%]'>
          <h4 className="font-semibold mb-4">Profil</h4>
          <ul className="list-disc space-y-1 text-sm pl-8">
            <li><a href="#" className="hover:underline">Sejarah</a></li>
            <li><a href="#" className="hover:underline">Organisasi</a></li>
            <li><a href="#" className="hover:underline">Pimpinan</a></li>
            <li><a href="#" className="hover:underline">Eselon</a></li>
          </ul>
        </div>

        <div className="pt-6 flex flex-col items-start space-y-3">
          <h4 className="font-semibold">Hubungi Kami</h4>
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="h-5 w-5" />
            <a href="mailto:klhupt@gmail.com" className="text-sm hover:underline">klhupt@gmail.com</a>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="h-5 w-5" />
            <span className="text-sm">021-8517183</span>
          </div>
          {/* Social Media Icons */}
          <div className="flex space-x-3 mt-2">
            <a href="#" className="flex flex-row justify-center items-center text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full shadow-xl">
              <img src={facebook}/>
            </a>
            <a href="#" className="flex flex-row justify-center items-center text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full shadow-xl">
              <img src={instagram}/>
            </a>
            <a href="#" className="flex flex-row justify-center items-center text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full shadow-xl">
                <img src={twitter}/>
            </a>
            <a href="#" className="flex flex-row justify-center items-center text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full shadow-xl">
                <img src={linkedin}/>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-row border-t border-gray-300 mt-8 pt-4 items-center justify-center text-sm h-20">
        Copyright © {new Date().getFullYear()} Kementerian Lingkungan Hidup dan Kehutanan - All rights Reserved
      </div>
    </footer>
    )
}