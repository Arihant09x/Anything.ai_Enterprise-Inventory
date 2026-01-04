import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Plus, Trash2, Edit, DollarSign, Package as PackageIcon, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

    // New Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        productLogo: ''
    });

    const gridRef = useRef(null);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data);
            // Animate items in
            if (gridRef.current) {
                gsap.fromTo(gridRef.current.children,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
                );
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted successfully");
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            // Error handled by interceptor
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                console.log(editingProduct.id);
                const response = await api.put(`/products/${editingProduct.id}`, newProduct);
                console.log(newProduct);

                toast.success("Product updated successfully");
                setProducts(products.map(p => p.id === editingProduct.id ? response.data.data : p));
            } else {
                const response = await api.post('/products', newProduct);
                toast.success("Product added successfully");
                setProducts([...products, response.data.data]);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setNewProduct({ name: '', price: '', stock: '', description: '', ProductLogo: '' });
        } catch (error) {
            // Error handled by interceptor
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name || '',
            price: product.price || '',
            stock: product.stock || '',
            description: product.description || '',
            ProductLogo: product.ProductLogo || ''
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setNewProduct({ name: '', price: '', stock: '', description: '', ProductLogo: '' });
        setIsModalOpen(true);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Product Inventory</h1>
                    {isAdmin && (
                        <Button onClick={openAddModal} variant="primary">
                            <Plus size={20} />
                            Add Product
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <Card key={product.id} hoverEffect={true} className="flex flex-col h-full overflow-hidden !p-0">
                                <div className="h-64 overflow-hidden relative bg-slate-100 group">
                                    {product.ProductLogo ? (
                                        <img
                                            src={product.ProductLogo}
                                            alt={product.name}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400">
                                            <PackageIcon size={48} />
                                        </div>
                                    )}
                                    {isAdmin ? (
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 shadow-md"
                                                title="Edit Product"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                onClick={() => navigate(`/checkout/${product.id}`)}
                                                variant="primary"
                                                className="!py-1 !px-3 !text-sm shadow-lg"
                                            >
                                                Buy
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={product.name}>{product.name}</h3>
                                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-sm">
                                            ${product.price}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4 flex-1">{product.description || 'No description available.'}</p>

                                    <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-1">
                                            <PackageIcon size={16} className="text-slate-400" />
                                            <span>Stock:</span>
                                        </div>
                                        <span className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {product.stock} units
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <PackageIcon size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                        <p className="mt-1 text-slate-500">Get started by creating a new product.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add New Product"}>
                <form onSubmit={handleSaveProduct}>
                    <Input
                        label="Product Name"
                        id="name"
                        className='text-black'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                        placeholder="e.g. Wireless Headphones"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price ($)"
                            className='text-black'
                            type="number"
                            id="price"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                        />
                        <Input
                            label="Stock"
                            className='text-black'
                            type="number"
                            id="stock"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            required
                            min="0"
                            placeholder="0"
                        />
                    </div>
                    <Input
                        label="Description"
                        className='text-black'
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Product detailed description..."
                    />
                    <Input
                        label="Image URL"
                        className='text-black'
                        type="url"
                        id="ProductLogo"
                        value={newProduct.ProductLogo}
                        onChange={(e) => setNewProduct({ ...newProduct, ProductLogo: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editingProduct ? "Update Product" : "Create Product"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
