
import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';

const allMachineCategories = [
    { id: 1, name: 'Spinning', slug: 'spinning', description: 'Machines for spinning raw fiber into yarn.', image: 'https://picsum.photos/seed/spinning/800/600' },
    { id: 2, name: 'Weaving', slug: 'weaving', description: 'Machines for weaving yarn into fabric.', image: 'https://picsum.photos/seed/weaving/800/600' },
    { id: 3, name: 'Finishing', slug: 'finishing', description: 'Machines for dyeing, printing, and finishing fabrics.', image: 'https://picsum.photos/seed/finishing/800/600' },
];

const allMachines = [
    { id: 1, categoryId: 1, name: { en: 'Ring Spinner 5000', vn: 'Máy Kéo Sợi Vòng 5000' }, slug: 'ring-spinner-5000', main_image: 'https://picsum.photos/seed/m1/400', short_description: { en: 'High-efficiency automated ring spinning machine.', vn: 'Máy kéo sợi vòng tự động hiệu suất cao.'}, gallery_images:[], full_description: {en: '', vn: ''}, specifications: [], features_list: [], manufacturer: 'TexPro', brochure_pdf: '', related_machines: [] },
    { id: 2, categoryId: 1, name: { en: 'Open-End Rotor XT', vn: 'Máy Rotor XT Mở' }, slug: 'open-end-rotor-xt', main_image: 'https://picsum.photos/seed/m2/400', short_description: { en: 'Versatile rotor spinning for various fiber types.', vn: 'Kéo sợi rotor linh hoạt cho nhiều loại xơ.'}, gallery_images:[], full_description: {en: '', vn: ''}, specifications: [], features_list: [], manufacturer: 'SpinTech', brochure_pdf: '', related_machines: [] },
    { id: 3, categoryId: 2, name: { en: 'AirJet Loom 9X', vn: 'Máy Dệt Khí 9X' }, slug: 'airjet-loom-9x', main_image: 'https://picsum.photos/seed/m3/400', short_description: { en: 'Top-speed airjet loom for mass production.', vn: 'Máy dệt khí tốc độ cao cho sản xuất hàng loạt.'}, gallery_images:[], full_description: {en: '', vn: ''}, specifications: [], features_list: [], manufacturer: 'WeaveMaster', brochure_pdf: '', related_machines: [] },
];


const MachineListScreen = () => {
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const [machines, setMachines] = useState(allMachines);

    const category = useMemo(() => allMachineCategories.find(c => c.slug === categorySlug), [categorySlug]);
    const categoryMachines = useMemo(() => machines.filter(m => m.categoryId === category?.id), [machines, category]);
    
    if (!category) {
        return <div className="text-center p-8">Category not found. <Link to="/machines" className="text-indigo-600 dark:text-indigo-400">Go back</Link></div>;
    }

    const handleCreate = () => {
        navigate(`/machines/${categorySlug}/new`);
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this machine?')) {
            setMachines(machines.filter(m => m.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link to="/machines" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2">
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Machine Categories
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Machines in {category.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <Plus size={18} className="mr-1" />
                    Create Machine
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Machine Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Manufacturer</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {categoryMachines.map((machine) => (
                                <tr key={machine.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-md object-cover" src={machine.main_image} alt={machine.name.en} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{machine.name.en}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{machine.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-sm truncate">{machine.short_description.en}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{machine.manufacturer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/machines/${categorySlug}/${machine.slug}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1"><Edit size={18} /></Link>
                                            <button onClick={() => handleDelete(machine.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                             {categoryMachines.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                        No machines found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MachineListScreen;