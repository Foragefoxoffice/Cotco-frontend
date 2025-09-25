
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, X, Upload, FileText } from 'lucide-react';
import TranslationTabs from '../components/TranslationTabs';
import WysiwygEditor from '../components/WysiwygEditor';

// Mock Data
const allMachines = [
    { id: 1, categoryId: 1, name: { en: 'Ring Spinner 5000', vn: 'Máy Kéo Sợi Vòng 5000' }, slug: 'ring-spinner-5000', main_image: 'https://picsum.photos/seed/m1/400', short_description: { en: 'High-efficiency automated ring spinning machine.', vn: 'Máy kéo sợi vòng tự động hiệu suất cao.'}, full_description: {en: 'Full markdown description here.', vn: 'Mô tả markdown đầy đủ ở đây.'}, gallery_images:['https://picsum.photos/seed/m1-g1/400', 'https://picsum.photos/seed/m1-g2/400'], specifications: [{id: 1, key: 'Speed', value: '25,000 rpm'}], features_list: ['Auto-doffing', 'Energy efficient'], manufacturer: 'TexPro', brochure_pdf: '/path/to/brochure.pdf', related_machines: [2] },
];

const blankMachine = {
    name: { en: '', vn: '' }, slug: '', main_image: '', gallery_images: [],
    short_description: { en: '', vn: '' }, full_description: { en: '', vn: '' },
    specifications: [], features_list: [], manufacturer: '', brochure_pdf: '', related_machines: []
};

const MachineEditScreen = () => {
    const { categorySlug, machineSlug } = useParams();
    const navigate = useNavigate();
    const brochureInputRef = useRef(null);
    
    const isCreating = machineSlug === 'new';
    
    const machineData = useMemo(() => {
        if (isCreating) return null;
        return allMachines.find(m => m.slug === machineSlug);
    }, [machineSlug, isCreating]);

    const [formData, setFormData] = useState(isCreating ? blankMachine : machineData);
    const [brochureFile, setBrochureFile] = useState(null);
    const [activeLanguage, setActiveLanguage] = useState('en');

    useEffect(() => {
        if (!isCreating && machineData) {
            setFormData(machineData);
        }
    }, [machineData, isCreating]);
    
    if (!isCreating && !formData) {
        return <div>Machine not found.</div>;
    }
    
    const handleInputChange = (field, value) => {
        const translatableFields = ['name', 'short_description', 'full_description'];
        if (translatableFields.includes(field)) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field], [activeLanguage]: value }}));
        } else {
             setFormData(prev => ({ ...prev, [field]: value }));
        }
    };
    
    const handleBrochureChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setBrochureFile(e.target.files[0]);
            // You might want to upload and get a URL here, for now we just store the file info
            handleInputChange('brochure_pdf', e.target.files[0].name);
        }
    };

    const handleRemoveBrochure = () => {
        setBrochureFile(null);
        handleInputChange('brochure_pdf', '');
        if (brochureInputRef.current) {
            brochureInputRef.current.value = "";
        }
    };

    // --- Specifications ---
    const addSpecification = () => {
        const newSpec = { id: Date.now(), key: '', value: '' };
        handleInputChange('specifications', [...formData.specifications, newSpec]);
    };
    const updateSpecification = (id, field, value) => {
        const updatedSpecs = formData.specifications.map(s => s.id === id ? { ...s, [field]: value } : s);
        handleInputChange('specifications', updatedSpecs);
    };
    const removeSpecification = (id) => {
        const updatedSpecs = formData.specifications.filter(s => s.id !== id);
        handleInputChange('specifications', updatedSpecs);
    };

    // --- Features ---
    const addFeature = () => {
        handleInputChange('features_list', [...formData.features_list, '']);
    };
    const updateFeature = (index, value) => {
        const updatedFeatures = formData.features_list.map((f, i) => i === index ? value : f);
        handleInputChange('features_list', updatedFeatures);
    };
    const removeFeature = (index) => {
        const updatedFeatures = formData.features_list.filter((_, i) => i !== index);
        handleInputChange('features_list', updatedFeatures);
    };

    const handleSave = () => {
        console.log("Saving machine:", { ...formData, brochureFile });
        navigate(`/machines/${categorySlug}`);
    };

    const inputClasses = "mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link to={`/machines/${categorySlug}`} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2">
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Machine List
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{isCreating ? 'Create New Machine' : `Editing: ${formData.name.en}`}</h1>
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    {isCreating ? 'Publish Machine' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <TranslationTabs activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />
                <div className="mt-6 space-y-6">
                    {/* Name & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Machine Name</label>
                            <input type="text" className={inputClasses} value={formData.name[activeLanguage]} onChange={e => handleInputChange('name', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClasses}>Slug</label>
                            <input type="text" className={inputClasses} value={formData.slug} onChange={e => handleInputChange('slug', e.target.value)} />
                        </div>
                    </div>
                    
                    {/* Short Description */}
                     <div>
                        <label className={labelClasses}>Short Description</label>
                        <textarea rows={3} className={inputClasses} value={formData.short_description[activeLanguage]} onChange={e => handleInputChange('short_description', e.target.value)} />
                    </div>

                    {/* Full Description */}
                     <div>
                        <label className={labelClasses}>Full Description</label>
                        <WysiwygEditor 
                            value={formData.full_description[activeLanguage]} 
                            onChange={content => handleInputChange('full_description', content)}
                        />
                    </div>
                    
                    {/* Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className={labelClasses}>Main Image URL</label>
                            <input type="text" className={inputClasses} value={formData.main_image} onChange={e => handleInputChange('main_image', e.target.value)} />
                        </div>
                         <div>
                            <label className={labelClasses}>Gallery Image URLs (one per line)</label>
                            <textarea rows={3} className={inputClasses} value={formData.gallery_images.join('\n')} onChange={e => handleInputChange('gallery_images', e.target.value.split('\n'))} />
                        </div>
                    </div>
                    
                    {/* Manufacturer & Brochure */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className={labelClasses}>Manufacturer</label>
                            <input type="text" className={inputClasses} value={formData.manufacturer} onChange={e => handleInputChange('manufacturer', e.target.value)} />
                        </div>
                         <div>
                            <label className={labelClasses}>Brochure PDF</label>
                             <div className="mt-1 flex items-center space-x-4">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    ref={brochureInputRef}
                                    onChange={handleBrochureChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => brochureInputRef.current?.click()}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium flex items-center"
                                >
                                    <Upload size={16} className="mr-2"/>
                                    Upload PDF
                                </button>
                                {brochureFile ? (
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <FileText size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                        <span>{brochureFile.name}</span>
                                        <button onClick={handleRemoveBrochure} className="ml-2 text-red-500 hover:text-red-700"><X size={16}/></button>
                                    </div>
                                ) : formData.brochure_pdf && (
                                   <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <FileText size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                                        <a href={formData.brochure_pdf} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{formData.brochure_pdf.split('/').pop()}</a>
                                        <button onClick={handleRemoveBrochure} className="ml-2 text-red-500 hover:text-red-700"><X size={16}/></button>
                                   </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Specifications */}
                    <div>
                        <label className={`${labelClasses} mb-2`}>Specifications</label>
                        <div className="space-y-2">
                        {formData.specifications.map(spec => (
                            <div key={spec.id} className="flex items-center gap-2">
                                <input type="text" placeholder="Key (e.g. Speed)" value={spec.key} onChange={e => updateSpecification(spec.id, 'key', e.target.value)} className={`w-1/3 ${inputClasses}`} />
                                <input type="text" placeholder="Value" value={spec.value} onChange={e => updateSpecification(spec.id, 'value', e.target.value)} className={`flex-grow ${inputClasses}`} />
                                <button onClick={() => removeSpecification(spec.id)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        </div>
                        <button onClick={addSpecification} className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"><Plus size={16} className="mr-1" /> Add Specification</button>
                    </div>

                    {/* Features */}
                    <div>
                        <label className={`${labelClasses} mb-2`}>Features</label>
                        <div className="space-y-2">
                        {formData.features_list.map((feature, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <input type="text" placeholder="Feature description" value={feature} onChange={e => updateFeature(index, e.target.value)} className={`flex-grow ${inputClasses}`} />
                                <button onClick={() => removeFeature(index)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        </div>
                        <button onClick={addFeature} className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"><Plus size={16} className="mr-1" /> Add Feature</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineEditScreen;