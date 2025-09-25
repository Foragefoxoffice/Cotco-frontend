
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import TranslationTabs from '../components/TranslationTabs';

const machineCategoriesData = [
    { id: 1, name: 'Spinning', slug: 'spinning', description: 'Machines for spinning raw fiber into yarn.', machineCount: 5, image: 'https://picsum.photos/seed/spinning/800/600' },
    { id: 2, name: 'Weaving', slug: 'weaving', description: 'Machines for weaving yarn into fabric.', machineCount: 8, image: 'https://picsum.photos/seed/weaving/800/600' },
    { id: 3, name: 'Finishing', slug: 'finishing', description: 'Machines for dyeing, printing, and finishing fabrics.', machineCount: 12, image: 'https://picsum.photos/seed/finishing/800/600' },
];

const pageContent = {
    title: { en: 'Machines', vn: 'Máy móc' },
    intro_text: {
        en: 'Explore our range of advanced textile machinery, designed for efficiency, reliability, and superior quality output. From spinning to finishing, we provide state-of-the-art solutions to meet all your production needs.',
        vn: 'Khám phá loạt máy móc dệt may tiên tiến của chúng tôi, được thiết kế để mang lại hiệu quả, độ tin cậy và chất lượng sản phẩm vượt trội. Từ kéo sợi đến hoàn thiện, chúng tôi cung cấp các giải pháp hiện đại để đáp ứng mọi nhu cầu sản xuất của bạn.'
    }
}

const MachinesScreen = () => {
    const [activeLanguage, setActiveLanguage] = useState('en');

    return (
        <div>
            <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pageContent.title[activeLanguage]}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{pageContent.intro_text[activeLanguage]}</p>
                 <div className="mt-4">
                    <TranslationTabs activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />
                 </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Machine Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machineCategoriesData.map((category) => (
                    <Link
                        to={`/machines/${category.slug}`}
                        key={category.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-indigo-500/10 transition-shadow transform hover:-translate-y-1 duration-200 group"
                    >
                        <div className="h-48 overflow-hidden">
                            <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                    <Cpu size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                                    {category.name}
                                </h3>
                                <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {category.machineCount} machines
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 h-10">{category.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MachinesScreen;