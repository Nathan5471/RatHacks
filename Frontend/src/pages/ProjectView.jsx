import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/projects.json';

export default function ProjectView() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const projectData = data.projects.find(p => p.id === id);
            if (projectData) {
                setProject(projectData);
            } else {
                console.error(`Project with id ${id} not found`);
                setProject(null);
            }
            setLoading(false);
        }

        fetchProject();
    }, [id]);

    if (loading) {
        return <div className="text-center text-2xl p-5">Loading project...</div>;
    }
    if (project === null) {
        return <div className="text-center text-2xl p-5">Project not found.</div>;
    }

    return (
        <div className="flex flex-col min-h-screen min-w-screen bg-[#121212] text-white">
            <div className="flex justify-center min-h-15 min-w-screen bg-[#282828] shadow-lg">
                <h1 className="text-3xl font-bold text-center p-4">Rat Hacks</h1>
            </div>
            <h2 className="text-4xl font-semibold text-center p-5">{project.title}</h2>
            <div className="flex justify-center">
                <video className="w-[calc(50%)] h-auto mt-5" controls>
                    <source src={project.videoLink} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="flex flex-col items-center p-5">
                <p className="text-gray-400">Made by {project.hackers.join(', ')}</p>
                <h3 className="text-2xl font-semibold text-[#48c554] mt-4">Description</h3>
                <p className="text-lg text-white mb-2 p-5">{project.description}</p>
                <h3 className="text-2xl font-semibold text-[#48c554] mt-4">Technologies</h3>
                <p className="text-lg text-white mb-2 p-5">{project.technologies}</p>
                { project.other !== "" ? (
                    <div className="flex flex-col items-center">
                        <h3 className="text-2xl font-semibold text-[#48c554] mt-4">Other</h3>
                        <p className="text-lg text-white mb-2 p-5">{project.other}</p>
                    </div>
                ) : null }
                <div className="flex flex-row mt-5">
                    <Link to="/projects" className="bg-[#17bd3d] font-bold text-lg rounded-lg p-2 shadow-lg text-white mr-4">
                        Back to Projects
                    </Link>
                    <a href={project.codeLink} target="_blank" rel="noopener noreferrer" className="bg-[#17bd3d] font-bold text-lg rounded-lg p-2 shadow-lg text-white">
                        View code
                    </a>
                </div>
            </div>
        </div>
    )
}