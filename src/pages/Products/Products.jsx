import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    DollarSign,
    Box,
    Tag,
    Plus,
    Filter,
    Search,
    Bell,
    Menu,
    X,
    Eye,
    Calendar,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Edit2,
    Trash2,
    LogOut
} from 'lucide-react';
import LogoInfostock from '../../assets/logo_infostock.png';
import { useProducts } from '../../hooks/useProducts';
import { useStock } from '../../hooks/useStock';
import { useSuppliers } from '../../hooks/useSuppliers';
import { getUser, isAuthenticated, hasPermission, logout } from '../../utils/auth';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Modal de Produto - Componente Otimizado
const ProductModal = React.memo(({ 
    show, 
    onClose, 
    productForm, 
    onFormChange, 
    onSubmit, 
    isEditing 
}) => {
    if (!show) return null;

    const handleInputChange = useCallback((field, value) => {
        onFormChange({ ...productForm, [field]: value });
    }, [productForm, onFormChange]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-neutral-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h3>
                        <button onClick={onClose}>
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">SKU *</label>
                            <input
                                type="text"
                                value={productForm.sku}
                                onChange={(e) => handleInputChange('sku', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Nome *</label>
                            <input
                                type="text"
                                value={productForm.nome}
                                onChange={(e) => handleInputChange('nome', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Categoria *</label>
                            <input
                                type="text"
                                value={productForm.categoria}
                                onChange={(e) => handleInputChange('categoria', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Marca</label>
                            <input
                                type="text"
                                value={productForm.marca}
                                onChange={(e) => handleInputChange('marca', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Modelo</label>
                            <input
                                type="text"
                                value={productForm.modelo}
                                onChange={(e) => handleInputChange('modelo', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Preço *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={productForm.preco}
                                onChange={(e) => handleInputChange('preco', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Garantia (meses)</label>
                            <input
                                type="number"
                                value={productForm.garantia}
                                onChange={(e) => handleInputChange('garantia', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                            <select
                                value={productForm.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="ATIVO">ATIVO</option>
                                <option value="INATIVO">INATIVO</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                            {isEditing ? 'Atualizar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

ProductModal.displayName = 'ProductModal';

// Modal de Estoque - Componente Otimizado
const StockModal = React.memo(({ 
    show, 
    onClose, 
    stockForm, 
    onFormChange, 
    onSubmit, 
    operation 
}) => {
    if (!show || !operation.product) return null;

    const handleInputChange = useCallback((field, value) => {
        onFormChange({ ...stockForm, [field]: value });
    }, [stockForm, onFormChange]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6 border-b border-neutral-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                            {operation.type === 'entrada' ? 'Entrada de Estoque' : 'Saída de Estoque'}
                        </h3>
                        <button onClick={onClose}>
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <p className="text-sm text-neutral-600 mt-2">{operation.product.nome}</p>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Quantidade *</label>
                        <input
                            type="number"
                            min="1"
                            value={stockForm.quantidade}
                            onChange={(e) => handleInputChange('quantidade', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Origem *</label>
                        <select
                            value={stockForm.origem}
                            onChange={(e) => handleInputChange('origem', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                            {operation.type === 'entrada' ? (
                                <>
                                    <option value="COMPRA_FORNECEDOR">Compra de Fornecedor</option>
                                    <option value="DEVOLUCAO">Devolução</option>
                                    <option value="AJUSTE_INVENTARIO">Ajuste de Inventário</option>
                                </>
                            ) : (
                                <>
                                    <option value="VENDA">Venda</option>
                                    <option value="AJUSTE_INVENTARIO">Ajuste de Inventário</option>
                                    <option value="PERDA">Perda</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white rounded-lg ${
                                operation.type === 'entrada'
                                    ? 'bg-success-500 hover:bg-success-600'
                                    : 'bg-danger-500 hover:bg-danger-600'
                            }`}
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

StockModal.displayName = 'StockModal';

const Products = () => {
    const navigate = useNavigate();
    const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
    const { movements, addStock, removeStock, fetchMovements } = useStock();
    const { suppliers, fetchActiveSuppliers } = useSuppliers();

    const [activeTab, setActiveTab] = useState('visualization');
    const [activeSection, setActiveSection] = useState('Produtos');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [stockOperation, setStockOperation] = useState({ type: 'entrada', product: null });
    const user = getUser();

    const [productForm, setProductForm] = useState({
        sku: '',
        nome: '',
        categoria: '',
        marca: '',
        modelo: '',
        preco: '',
        garantia: 12,
        status: 'ATIVO'
    });

    const [stockForm, setStockForm] = useState({
        quantidade: '',
        origem: 'COMPRA_FORNECEDOR'
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        loadData();
    }, [navigate]);

    const loadData = async () => {
        await Promise.all([
            fetchProducts(),
            fetchMovements(),
            fetchActiveSuppliers()
        ]);
    };

    // Estatísticas calculadas
    const stats = {
        totalValue: (products || []).reduce((sum, p) => {
            const preco = parseFloat(p?.preco) || 0;
            const qtd = parseInt(p?.quantidade_estoque) || 0;
            return sum + (preco * qtd);
        }, 0),
        totalProducts: (products || []).reduce((sum, p) => {
            const qtd = parseInt(p?.quantidade_estoque) || 0;
            return sum + qtd;
        }, 0),
        categories: [...new Set((products || []).map(p => p?.categoria).filter(Boolean))].length
    };

    const Sidebar = ({ active, onNavigate }) => {
        const navItems = [
            { name: 'Dashboard', icon: LayoutDashboard, current: active === 'Dashboard', path: '/home' },
            { name: 'Produtos', icon: Package, current: active === 'Produtos', path: '/products' },
            { name: 'Parceiros', icon: Users, current: active === 'Parceiros', path: '/suppliers' },
            { name: 'Vendas', icon: ShoppingCart, current: active === 'Vendas', path: '/sales' },
        ];

        const handleNavigation = (item) => {
            onNavigate && onNavigate(item.name);
            if (item.name !== active) {
                navigate(item.path);
            }
            setSidebarOpen(false);
        };

        return (
            <>
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:shadow-none w-64 border-r border-neutral-200 flex flex-col`}>

                    <div className="flex items-center justify-between h-16 lg:h-20 px-4 lg:px-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-neutral-200 lg:border-b-0">
                        <img
                            src={LogoInfostock}
                            alt="Logotipo InfoStock"
                            className="h-8 lg:h-auto w-auto object-contain"
                        />
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                        >
                            <X className="h-5 w-5 text-neutral-600" />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item)}
                                className={`w-full flex items-center px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    item.current
                                        ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                                        : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600 hover:transform hover:scale-105'
                                }`}
                            >
                                <item.icon className="mr-2 lg:mr-3 h-4 lg:h-5 w-4 lg:w-5" />
                                <span className="text-xs lg:text-sm">{item.name}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="px-3 lg:px-4 py-4 border-t border-neutral-200">
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="w-full flex items-center px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm font-semibold transition-all duration-200 text-danger-600 hover:bg-danger-50 hover:transform hover:scale-105"
                        >
                            <LogOut className="mr-2 lg:mr-3 h-4 lg:h-5 w-4 lg:w-5" />
                            <span className="text-xs lg:text-sm">Sair</span>
                        </button>
                    </div>
                </div>
            </>
        );
    };

    const InfoCard = ({ title, value, icon: Icon, bgColor, iconColor }) => (
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm p-4 lg:p-6 border border-neutral-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl ${bgColor} shadow-sm`}>
                    <Icon className={`h-5 lg:h-6 w-5 lg:w-6 ${iconColor}`} />
                </div>
            </div>
            <p className="text-xs lg:text-sm font-semibold text-neutral-600 mb-1 lg:mb-2">{title}</p>
            <p className="text-xl lg:text-3xl font-bold text-primary-600 mb-2 lg:mb-3">{value}</p>
        </div>
    );

    const TabNavigation = () => {
        const tabs = [
            { id: 'visualization', name: 'Visualização', icon: Eye },
            { id: 'stock-entry', name: 'Entrada de Estoque', icon: Plus },
            { id: 'movements', name: 'Movimentações', icon: Calendar }
        ];

        return (
            <div className="mb-6">
                <div className="grid grid-cols-3 gap-0 bg-neutral-100 rounded-lg p-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-center px-3 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-neutral-600 hover:text-neutral-800'
                                }`}
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">{tab.name}</span>
                                <span className="sm:hidden">
                                    {tab.id === 'visualization' ? 'Ver' :
                                        tab.id === 'stock-entry' ? 'Entrada' : 'Mov.'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleProductSubmit = useCallback(async (e) => {
        e.preventDefault();

        const data = {
            ...productForm,
            preco: parseFloat(productForm.preco),
            garantia: parseInt(productForm.garantia)
        };

        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct.ID, data);
        } else {
            result = await createProduct(data);
        }

        if (result.success) {
            alert(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso! O estoque foi criado automaticamente com quantidade = 0.');
            setShowProductModal(false);
            resetProductForm();
            await fetchProducts();
        } else {
            alert(`Erro: ${result.error}`);
        }
    }, [productForm, editingProduct, createProduct, updateProduct, fetchProducts]);

    const handleStockSubmit = useCallback(async (e) => {
        e.preventDefault();

        const quantidade = parseInt(stockForm.quantidade);
        const { product, type } = stockOperation;
        const productId = product.id || product.ID;

        let result;
        if (type === 'entrada') {
            result = await addStock(productId, quantidade, stockForm.origem);
        } else {
            result = await removeStock(productId, quantidade, stockForm.origem);
        }

        if (result.success) {
            alert(`${type === 'entrada' ? 'Entrada' : 'Saída'} de estoque registrada com sucesso! Quantidade: ${quantidade} unidades.`);
            setShowStockModal(false);
            resetStockForm();
            await Promise.all([fetchProducts(), fetchMovements()]);
        } else {
            alert(`Erro ao registrar ${type === 'entrada' ? 'entrada' : 'saída'}: ${result.error}`);
        }
    }, [stockForm, stockOperation, addStock, removeStock, fetchProducts, fetchMovements]);

    const handleProductFormChange = useCallback((newForm) => {
        setProductForm(newForm);
    }, []);

    const handleStockFormChange = useCallback((newForm) => {
        setStockForm(newForm);
    }, []);

    const handleCloseProductModal = useCallback(() => {
        setShowProductModal(false);
        resetProductForm();
    }, []);

    const handleCloseStockModal = useCallback(() => {
        setShowStockModal(false);
        resetStockForm();
    }, []);

    const resetProductForm = () => {
        setProductForm({
            sku: '',
            nome: '',
            categoria: '',
            marca: '',
            modelo: '',
            preco: '',
            garantia: 12,
            status: 'ATIVO'
        });
        setEditingProduct(null);
    };

    const resetStockForm = () => {
        setStockForm({
            quantidade: '',
            origem: 'COMPRA_FORNECEDOR'
        });
        setStockOperation({ type: 'entrada', product: null });
    };

    const handleEdit = (product) => {
        const productId = product.id || product.ID;
        setEditingProduct({ ...product, ID: productId }); // Normalizar para ID maiúsculo
        setProductForm({
            sku: product.sku,
            nome: product.nome,
            categoria: product.categoria,
            marca: product.marca || '',
            modelo: product.modelo || '',
            preco: product.preco.toString(),
            garantia: product.garantia || 12,
            status: product.status
        });
        setShowProductModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            const result = await deleteProduct(id);
            if (result.success) {
                await fetchProducts();
            }
        }
    };

    const handleStockOperation = (product, type) => {
        setStockOperation({ product, type });
        setShowStockModal(true);
    };

    const filteredProducts = (products || []).filter(product =>
        (product?.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product?.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product?.categoria || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const VisualizationTable = () => (
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-neutral-200 bg-neutral-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
                    <h3 className="text-base lg:text-lg font-semibold text-neutral-900">Estoque de Produtos</h3>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        {hasPermission(['ADMIN', 'GERENTE']) && (
                            <button
                                onClick={() => setShowProductModal(true)}
                                className="flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Produto
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">ID</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Produto</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Categoria</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Fornecedor</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Quantidade</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Valor Unit.</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Valor Total</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Status</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="px-6 py-8 text-center text-neutral-500">
                                    <div className="flex justify-center items-center">
                                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                                        Carregando...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="px-6 py-8 text-center text-neutral-500">
                                    Nenhum produto encontrado
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => {
                                // Validação de segurança para evitar erros
                                // Backend retorna 'id' minúsculo, não 'ID' maiúsculo
                                const productId = product.id || product.ID;
                                if (!product || !productId) return null;
                                
                                return (
                                <tr key={productId} className="hover:bg-neutral-50 transition-colors duration-150">
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                        #{productId.toString().padStart(3, '0')}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 lg:w-10 h-8 lg:h-10 bg-neutral-200 rounded-lg mr-2 lg:mr-3 flex items-center justify-center">
                                                <Package className="h-4 lg:h-5 w-4 lg:w-5 text-neutral-500" />
                                            </div>
                                            <div className="text-xs lg:text-sm font-medium text-neutral-900">
                                                {product.nome || 'Sem nome'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                        {product.categoria || '-'}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                        {product.fornecedores && product.fornecedores.length > 0
                                            ? product.fornecedores[0].nome
                                            : '-'}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                        {product.quantidade_estoque || 0}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                        {formatCurrency(product.preco || 0)}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                        {formatCurrency((product.preco || 0) * (product.quantidade_estoque || 0))}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-700">
                                            {product.status || 'ATIVO'}
                                        </span>
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                                        <div className="flex gap-2">
                                            {hasPermission(['ADMIN', 'GERENTE']) && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-600"
                                                        title="Editar produto"
                                                    >
                                                        <Edit2 className="h-3 w-3 mr-1" />
                                                        Editar
                                                    </button>
                                                    {hasPermission(['ADMIN']) && (
                                                        <button
                                                            onClick={() => handleDelete(productId)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-danger-500 hover:bg-danger-600"
                                                            title="Deletar produto"
                                                        >
                                                            <Trash2 className="h-3 w-3 mr-1" />
                                                            Deletar
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )})
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const StockEntryForm = () => (
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Gerenciar Estoque</h3>
                <p className="text-sm text-neutral-600">Selecione um produto e adicione ou remova quantidades do estoque</p>
            </div>

            <div className="space-y-4">
                {filteredProducts.map((product) => {
                    const productId = product.id || product.ID;
                    return (
                    <div key={productId} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <h4 className="font-semibold text-neutral-900">{product.nome}</h4>
                                <p className="text-sm text-neutral-600">SKU: {product.sku} | Estoque: {product.quantidade_estoque || 0}</p>
                            </div>
                            {hasPermission(['ADMIN', 'GERENTE']) && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStockOperation(product, 'entrada')}
                                        className="flex items-center px-3 py-2 bg-success-500 text-white rounded-lg text-sm hover:bg-success-600"
                                    >
                                        <ArrowUp className="h-4 w-4 mr-1" />
                                        Entrada
                                    </button>
                                    <button
                                        onClick={() => handleStockOperation(product, 'saida')}
                                        className="flex items-center px-3 py-2 bg-danger-500 text-white rounded-lg text-sm hover:bg-danger-600"
                                    >
                                        <ArrowDown className="h-4 w-4 mr-1" />
                                        Saída
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );

    const MovementsTable = () => (
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-neutral-200 bg-neutral-50">
                <h3 className="text-base lg:text-lg font-semibold text-neutral-900">Movimentações do Estoque</h3>
                <p className="text-xs lg:text-sm text-neutral-600 mt-1">Histórico completo de entradas e saídas</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Tipo</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Produto</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Quantidade</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Origem</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Usuário</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Data</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {movements.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-neutral-500">
                                    Nenhuma movimentação encontrada
                                </td>
                            </tr>
                        ) : (
                            movements.map((movement) => (
                                <tr key={movement.ID} className="hover:bg-neutral-50 transition-colors duration-150">
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            movement.tipo === 'ENTRADA'
                                                ? 'bg-success-100 text-success-700'
                                                : 'bg-danger-100 text-danger-700'
                                        }`}>
                                            {movement.tipo}
                                        </span>
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                        {movement.produto?.nome || '-'}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                        {movement.quantidade}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                        {movement.origem}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                        {movement.usuario?.nome || '-'}
                                    </td>
                                    <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                        {formatDate(movement.data_movimentacao || movement.CreatedAt)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const handleNavigation = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="flex h-screen bg-neutral-100">
            <Sidebar active={activeSection} onNavigate={handleNavigation} />

            <div className="flex-1 flex flex-col lg:ml-0">
                <header className="bg-white shadow-sm border-b border-neutral-200 h-14 lg:h-16 flex items-center justify-between lg:justify-end px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                    >
                        <Menu className="h-5 w-5 text-neutral-600" />
                    </button>

                    <div className="flex items-center space-x-2 lg:space-x-4">
                        <button
                            onClick={loadData}
                            className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        >
                            <RefreshCw className="h-4 lg:h-5 w-4 lg:w-5" />
                        </button>

                        <button className="relative p-2 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                            <Bell className="h-4 lg:h-5 w-4 lg:w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
                        </button>

                        <div className="flex items-center space-x-2 lg:space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs lg:text-sm font-semibold text-neutral-900">{user?.nome || 'Usuário'}</p>
                                <p className="text-xs text-neutral-500">{user?.perfil || 'Perfil'}</p>
                            </div>
                            <div className="h-8 lg:h-10 w-8 lg:w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-xs lg:text-sm font-bold text-white">
                                    {user?.nome?.substring(0, 2).toUpperCase() || 'US'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-3 lg:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8">
                        <InfoCard
                            title="Valor Total em Estoque"
                            value={formatCurrency(stats.totalValue)}
                            icon={DollarSign}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                        <InfoCard
                            title="Total Produtos em Estoque"
                            value={stats.totalProducts.toString()}
                            icon={Box}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                        <InfoCard
                            title="Categorias"
                            value={stats.categories.toString()}
                            icon={Tag}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                    </div>

                    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-3 lg:p-6">
                        <TabNavigation />

                        {activeTab === 'visualization' && <VisualizationTable />}
                        {activeTab === 'stock-entry' && <StockEntryForm />}
                        {activeTab === 'movements' && <MovementsTable />}
                    </div>
                </main>
            </div>

            <ProductModal 
                show={showProductModal}
                onClose={handleCloseProductModal}
                productForm={productForm}
                onFormChange={handleProductFormChange}
                onSubmit={handleProductSubmit}
                isEditing={!!editingProduct}
            />
            <StockModal 
                show={showStockModal}
                onClose={handleCloseStockModal}
                stockForm={stockForm}
                onFormChange={handleStockFormChange}
                onSubmit={handleStockSubmit}
                operation={stockOperation}
            />
        </div>
    );
};

export default Products;
