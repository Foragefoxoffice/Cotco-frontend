
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import ProductForm from '../components/forms/ProductForm';

// Mock Data - In a real app, this would come from an API
const allProducts = [
    // Cotton
    { id: 1, categoryId: 1, title: { en: 'Organic Cotton', vn: 'Bông hữu cơ' }, description: { en: '100% certified organic cotton.', vn: '100% bông hữu cơ được chứng nhận.' }, specifications: { en: '| Grade | Staple Length |\n|---|---|\n| Premium | 35mm |', vn: '| Hạng | Chiều dài xơ |\n|---|---|\n| Cao cấp | 35mm |' }, image: 'https://picsum.photos/seed/p1/400' },
    { id: 2, categoryId: 1, title: { en: 'Pima Cotton', vn: 'Bông Pima' }, description: { en: 'Extra-long staple cotton.', vn: 'Bông xơ siêu dài.' }, specifications: { en: '| Grade | Staple Length |\n|---|---|\n| Superior | 40mm |', vn: '| Thượng hạng | 40mm |' }, image: 'https://picsum.photos/seed/p2/400' },
    // Fiber
    { id: 3, categoryId: 2, title: { en: 'Recycled Polyester', vn: 'Polyester tái chế' }, description: { en: 'Made from recycled materials.', vn: 'Làm từ vật liệu tái chế.' }, specifications: { en: '| Denier | Tenacity |\n|---|---|\n| 1.4 | 6.5 gpd |', vn: '| Denier | Độ bền |\n|---|---|\n| 1.4 | 6.5 gpd |' }, image: 'https://picsum.photos/seed/p3/400' },
    // Machines
    { id: 4, categoryId: 3, title: { en: 'Spinning Machine', vn: 'Máy kéo sợi' }, description: { en: 'High-speed ring spinning frame.', vn: 'Khung kéo sợi vòng tốc độ cao.' }, specifications: { en: '| Speed | Spindles |\n|---|---|\n| 25,000 rpm | 1200 |', vn: '| Tốc độ | Cọc sợi |\n|---|---|\n| 25,000 vòng/phút | 1200 |' }, image: 'https://picsum.photos/seed/p4/400' },
];

const allCategories = [
    { id: 1, name: { en: 'Cotton', vn: 'Bông' }, slug: 'cotton', description: { en: 'Global cotton sourcing to power your production', vn: 'Nguồn cung ứng bông toàn cầu để cung cấp năng lượng cho sản xuất của bạn' }, image: 'https://picsum.photos/seed/cotton/800/600' },
    { id: 2, name: { en: 'Fiber', vn: 'Sợi' }, slug: 'fiber', description: { en: 'Eco-friendly fibers for sustainable textiles', vn: 'Sợi thân thiện với môi trường cho ngành dệt may bền vững' }, image: 'https://picsum.photos/seed/fiber/800/600' },
    { id: 3, name: { en: 'Machines', vn: 'Máy móc' }, slug: 'machines', description: { en: 'Advanced textile machinery for modern manufacturing', vn: 'Máy móc dệt may tiên tiến cho sản xuất hiện đại' }, image: 'https://picsum.photos/seed/machines/800/600' },
];

const ProductListScreen = () => {
    const { categorySlug } = useParams();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState(allProducts);
    
    const category = useMemo(() => allCategories.find(c => c.slug === categorySlug), [categorySlug]);
    const categoryProducts = useMemo(() => products.filter(p => p.categoryId === category?.id), [products, category]);

    if (!category) {
        return <div className="text-center p-8">Category not found. <Link to="/products" className="text-indigo-600 dark:text-indigo-400">Go back</Link></div>;
    }

    const handleCreate = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = (productData) => {
        if (editingProduct) {
            // Update
            setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...productData } : p));
        } else {
            // Create
            const newProduct = {
                id: Math.max(0, ...products.map(p => p.id)) + 1,
                categoryId: category.id,
                ...productData
            };
            setProducts([...products, newProduct]);
        }
        handleCloseForm();
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link to="/products" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2">
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Categories
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products in {category.name.en}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{category.description.en}</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <Plus size={18} className="mr-1" />
                    Create Product
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {categoryProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.title.en} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.title.en}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{product.title.vn}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-sm truncate">{product.description.en}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleEdit(product)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                             {categoryProducts.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                        No products found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <ProductForm product={editingProduct} onClose={handleCloseForm} onSave={handleSaveProduct} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductListScreen;