import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/projects.json';
import ProjectCard from '../components/ProjectCard.jsx';

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            setProjects(data.projects);
        };

        fetchProjects();
    }, []);

    return (
        <div className="flex flex-col min-h-screen min-w-screen bg-[#121212] text-white">
            <div className="min-h-15 min-w-screen bg-[#282828] shadow-lg">
                <h1 className="text-3xl font-bold text-center p-4">Rat Hacks</h1>
            </div>
            <h2 className="text-4xl font-semibold text-center p-5">Rat Hacks Projects</h2>
            { projects.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 p-10">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} id={project.id} />
                    ))}
                </div>
                ) : (
                <p className="text-2xl text-center p-5">
                    No projects available at the moment. Please check back later!
                </p>
                )}
        </div>
    );
}