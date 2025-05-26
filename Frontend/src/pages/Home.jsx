import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen min-w-screen bg-[#121212] text-white">
            <div className="min-h-15 min-w-screen bg-[#282828] shadow-lg">
                <h1 className="text-3xl font-bold text-center p-4">Rat Hacks</h1>
            </div>
            <h2 className="text-4xl font-semibold text-center p-5">A look back at Rat Hacks 2025</h2>
            <p className="text-2xl text-center p-5">
                Rat Hacks 2025 brought together high school hackers from multiple schools to collaborate on projects around the theme of "Education Tools"
            </p>
            <div className="grid grid-cols-3 gap-4 p-10">
                <div className="bg-[#282828] p-4 rounded-lg shadow-lg">
                    <h3 className="text-6xl font-semibold text-[#48c554] text-center">12</h3>
                    <p className="text-2xl text-center">Hours</p>
                </div>
                <div className="bg-[#282828] p-4 rounded-lg shadow-lg">
                    <h3 className="text-6xl font-semibold text-[#48c554] text-center">14</h3>
                    <p className="text-2xl text-center">Hackers</p>
                </div>
                <div className="bg-[#282828] p-4 rounded-lg shadow-lg">
                    <h3 className="text-6xl font-semibold text-[#48c554] text-center">7</h3>
                    <p className="text-2xl text-center">Projects</p>
                </div>
            </div>
            <h2 className="text-4xl font-semibold text-center p-5">See you next year!</h2>
            <div className="flex justify-center">
                <button className="bg-[#17bd3d] font-bold text-2xl rounded-lg p-3 m-5 shadow-lg">
                    <Link to="/projects" className="text-white no-underline">
                    Look at this year's projects
                    </Link>
                </button>
            </div>
        </div>
    )
}