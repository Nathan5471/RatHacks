import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/projects.json';

export default function ProjectCard({ id }) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const projectData = data.projects.find(p => p.id === id);
            if (projectData) {
                setProject(projectData);
            } else {
                console.error(`Project with id ${id} not found`);
            }
        }

        fetchProject().finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    return (
        <div className="flex flex-col bg-[#282828] p-4 rounded-lg shadow-lg m-4">
            <h3 className="text-2xl font-semibold text-[#48c554]">{project.title}</h3>
            <p className="text-sm text-gray-400">{project.hackers.join(", ")}</p>
            <p className="text-lg text-white mt-2 mb-2 max-h-40 overflow-scroll">{project.description}</p>
            <div className="flex mt-auto justify-center">
                <Link to={`/projects/${project.id}`}>
                    <button className="bg-[#17bd3d] font-bold text-lg rounded-lg p-2 shadow-lg text-white">
                        View Project
                    </button>
                </Link>
            </div>
        </div>
    )
}