import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Search,
    Plus,
    Minus,
    Bell,
    Menu,
    X
} from 'lucide-react';
import LogoInfostock from '../../assets/logo_infostock.png';

const Vendas = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Vendas');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState('');
    const [cep, setCep] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [cartItems, setCartItems] = useState([
        {
            id: 2,
            name: 'Memória RAM 16GB',
            price: 300.00,
            quantity: 2
        }
    ]);

    // Produtos disponíveis
    const availableProducts = [
        {
            id: 1,
            name: 'Placa de Vídeo RTX 4070',
            stock: 15,
            price: 5000.00
        },
        {
            id: 2,
            name: 'Memória RAM 16GB',
            stock: 25,
            price: 300.00
        }
    ];

    // Componente Sidebar Responsivo
    const Sidebar = ({ active, onNavigate }) => {
        const navItems = [
            { name: 'Dashboard', icon: LayoutDashboard, current: active === 'Dashboard', path: '/home' },
            { name: 'Produtos', icon: Package, current: active === 'Produtos', path: '/products' },
            { name: 'Fornecedores', icon: Users, current: active === 'Fornecedores', path: '/suppliers' },
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

                <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                                className={`w-full flex items-center px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm font-semibold transition-all duration-200 ${item.current
                                    ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                                    : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600 hover:transform hover:scale-105'
                                    }`}
                            >
                                <item.icon className="mr-2 lg:mr-3 h-4 lg:h-5 w-4 lg:w-5" />
                                <span className="text-xs lg:text-sm">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </>
        );
    };

    // Funções do carrinho
    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            setCartItems(cartItems.filter(item => item.id !== id));
        } else {
            setCartItems(cartItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleNavigation = (section) => {
        setActiveSection(section);

        if (section !== activeSection) {
            const routes = {
                'Dashboard': '/',
                'Produtos': '/products',
                'Fornecedores': '/suppliers',
                'Vendas': '/sales'
            };

            if (routes[section]) {
                navigate(routes[section]);
            }
        }
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
                        <button className="relative p-2 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                            <Bell className="h-4 lg:h-5 w-4 lg:w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
                        </button>

                        <div className="flex items-center space-x-2 lg:space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs lg:text-sm font-semibold text-neutral-900">Admin</p>
                                <p className="text-xs text-neutral-500">Administrador</p>
                            </div>
                            <div className="h-8 lg:h-10 w-8 lg:w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-xs lg:text-sm font-bold text-white">AD</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-3 lg:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {/* Coluna Esquerda - Clientes e Produtos */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Seção Superior - Clientes e Entrega */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Card Clientes */}
                                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Clientes</h3>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar clientes..."
                                            value={clientSearch}
                                            onChange={(e) => setClientSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                </div>

                                {/* Card Entrega */}
                                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Entrega</h3>
                                    <input
                                        type="text"
                                        placeholder="Digite o C.E.P"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            {/* Card Produtos Disponíveis */}
                            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex-1">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Produtos Disponíveis</h3>

                                {/* Campo de Busca */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                {/* Lista de Produtos */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableProducts
                                        .filter(product =>
                                            product.name.toLowerCase().includes(productSearch.toLowerCase())
                                        )
                                        .map((product) => (
                                            <div key={product.id} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                                <div className="flex flex-col h-full">
                                                    <div className="flex-1 mb-4">
                                                        <h4 className="font-medium text-neutral-900 mb-2">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-sm text-neutral-600 mb-2">
                                                            {product.stock} unidades
                                                        </p>
                                                        <p className="text-lg font-semibold text-neutral-900">
                                                            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className="w-full px-4 py-2 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 transition-colors duration-200"
                                                    >
                                                        Adicionar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Coluna Direita - Carrinho */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 h-fit">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-6">Carrinho</h3>

                                {/* Itens do Carrinho */}
                                <div className="space-y-4 mb-6">
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingCart className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                                            <p className="text-neutral-500">Carrinho vazio</p>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div key={item.id} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                                <h4 className="font-medium text-neutral-900 mb-3">
                                                    {item.name}
                                                </h4>

                                                {/* Controles de Quantidade */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-300 transition-colors duration-200"
                                                        >
                                                            <Minus className="h-4 w-4 text-neutral-600" />
                                                        </button>
                                                        <span className="font-medium text-neutral-900 min-w-[2rem] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-300 transition-colors duration-200"
                                                        >
                                                            <Plus className="h-4 w-4 text-neutral-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Valor do Item */}
                                                <p className="text-lg font-semibold text-neutral-900">
                                                    R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Total e Finalizar */}
                                {cartItems.length > 0 && (
                                    <>
                                        <div className="border-t border-neutral-200 pt-4 mb-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-semibold text-neutral-900">Total:</span>
                                                <span className="text-xl font-bold text-neutral-900">
                                                    R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>

                                        <button className="w-full py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors duration-200">
                                            Finalizar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Vendas;