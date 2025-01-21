import React, { useState } from 'react';
import { ChatBubbleLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { BsPeople } from "react-icons/bs";
import { LiaUserEditSolid } from "react-icons/lia";


export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* <h1>Home page</h1> */}

      <div className="bg-base-250 text-primary-content min-h-screen flex flex-col items-center mt-7">
        {/* Navbar */}
        <nav className="flex justify-between items-center w-full px-4 py-2 bg-base-250 mb-4">
          <div className="hidden sm:flex justify-between flex-grow">
		  	<img src="/pickle-pal-icon.svg" alt="Pickle Pal Icon" className="h-10 w-10" />
            <BsPeople className="h-10 w-10 text-primary" />
            <ChatBubbleLeftIcon className="h-10 w-10 text-primary" />
            <MapPinIcon className="h-10 w-10 text-primary" />
			<LiaUserEditSolid className="h-10 w-10 text-white" />
          </div>
          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-14 left-0 w-full bg-base-250 flex flex-col items-center space-y-4 py-4 sm:hidden">
              <BsPeople className="h-8 w-8 text-primary" />
              <ChatBubbleLeftIcon className="h-8 w-8 text-primary" />
              <MapPinIcon className="h-8 w-8 text-primary" />
            </div>
          )}
        </nav>

        <main className="flex-grow flex flex-col items-center p-4">
          {/* Card Component */}
          <div className="card w-full max-w-lg bg-base-200 shadow-xl">
            <figure>
              <img
                src="/pickleball.webp"
                alt="Player"
                className="object-cover mt-6 h-48 rounded-lg w-3/4"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-white">
                Ben Johns <span className="badge badge-secondary bg-red-500 text-black">Advanced</span>
              </h2>
              <div className="mb-2">
                <p className="text-sm font-bold text-white">Playstyle</p>
                <span className="badge badge-outline badge-primary">Hybrid</span>
              </div>
              <div className="mb-2">
                <p className="text-sm font-bold text-white">Looking For</p>
                <span className="badge badge-success badge-primar bg-primary">
                  Good Competition
                </span>
              </div>
              <p className="text-sm font-bold text-white">Bio</p>
              <p className="text-sm mb-4 text-white">
                Professional pickleball player known for his aggressive playing
                style and strategic court positioning. Currently ranked as one of
                the top players in the world, Ben has dominated both singles and
                doubles competitions.
              </p>
              
            </div>
          </div>
		  <div className="flex justify-between items-center bg-base-300 p-5 w-full max-w-lg shadow-xl rounded-lg">
                <p className="text-sm font-bold text-white">DUPR Rating</p>
                <span className="text-lg font-bold text-primary">7.3</span>
        	</div>

          {/* Interaction Buttons */}
          <div className="flex space-x-10 mt-12">
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button className="btn btn-square btn-success bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
