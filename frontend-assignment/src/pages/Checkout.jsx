import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { ArrowLeft, Package, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data.data);
            } catch (error) {
                console.error("Failed to fetch product", error);
                toast.error("Product not found");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, navigate]);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const response = await api.post(`/products/${id}/checkout`, { quantity: parseInt(quantity) });
            setSuccess(true);
            toast.success("Purchase successful!");
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            // Error handled by interceptor, but custom message derived from response if available
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!product) return null;

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
                    <p className="text-slate-600 mb-6">
                        You have successfully purchased {quantity} x {product.name}.
                    </p>
                    <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
                    <Button variant="primary" className="mt-6 w-full" onClick={() => navigate('/')}>
                        Back to Dashboard Now
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex  items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors "
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Product Summary */}
                    <div className="md:col-span-5">
                        <Card className="p-0 overflow-hidden w-full">
                            <div className="h-64 bg-slate-100 relative">
                                {product.ProductLogo ? (
                                    <img
                                        src={product.ProductLogo}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <Package size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{product.name}</h3>
                                <p className="text-slate-500 text-sm mb-3 line-clamp-3">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-indigo-600">${product.price}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock} in stock
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Checkout Form */}
                    <div className="md:col-span-5 w-full">
                        <Card>
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 ">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Checkout</h2>
                            </div>

                            <form onSubmit={handleCheckout}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="!mb-0 w-24 text-black"
                                            required
                                        />
                                        <span className="text-slate-500 text-sm">
                                            Total: <strong className="text-slate-800 text-lg ml-1">${(product.price * quantity).toFixed(2)}</strong>
                                        </span>
                                    </div>
                                    {quantity > product.stock && (
                                        <p className="text-red-500 text-sm mt-1">Cannot match stock quantity.</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-slate-800 mb-2">Order Summary</h4>
                                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                                            <span>Subtotal ({quantity} items)</span>
                                            <span>${(product.price * quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                                            <span>Tax (0%)</span>
                                            <span>$0.00</span>
                                        </div>
                                        <div className="border-t border-slate-200 my-2 pt-2 flex justify-between font-bold text-slate-900">
                                            <span>Total</span>
                                            <span>${(product.price * quantity).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full justify-center py-3 text-lg"
                                        disabled={processing || quantity > product.stock || quantity < 1}
                                    >
                                        {processing ? 'Processing...' : 'Confirm Purchase'}
                                    </Button>
                                    <p className="text-xs text-center text-slate-400 mt-2">
                                        This is a demo secure transaction.
                                    </p>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
