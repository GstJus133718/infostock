import React, { useState, useEffect } from 'react';
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
    X,
    LogOut,
    XCircle
} from 'lucide-react';
import LogoInfostock from '../../assets/logo_infostock.png';
import { logout, getUser } from '../../utils/auth';
import { useSales, useClients, useProducts } from '../../hooks';
import { formatCurrency } from '../../utils/formatters';

const Vendas = () => {
    const navigate = useNavigate();
    const currentUser = getUser();
    const [activeSection, setActiveSection] = useState('Vendas');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { clients, fetchClients } = useClients();
    const { products, fetchProducts } = useProducts();
    const { sales, fetchSales, createSale } = useSales();

    useEffect(() => {
        console.log('Current User:', currentUser);
        const loadData = async () => {
            await Promise.all([
                fetchClients(),
                fetchProducts(),
                fetchSales()
            ]);
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredClients = clients.filter(client =>
        client.nome?.toLowerCase().includes(clientSearch.toLowerCase())
    );

    const filteredProducts = products.filter(product =>
        product.nome?.toLowerCase().includes(productSearch.toLowerCase()) &&
        product.status === 'ATIVO'
    );

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

    const addToCart = (product) => {
        console.log('Adicionando produto ao carrinho:', product);
        console.log('produto.ID:', product.ID);
        console.log('produto.id:', product.id);

        const produtoId = product.ID || product.id;
        console.log('produtoId final:', produtoId);

        const existingItem = cartItems.find(item => item.produto_id === produtoId);

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.produto_id === produtoId
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            ));
        } else {
            const newItem = {
                produto_id: produtoId,
                produto: product,
                quantidade: 1
            };
            console.log('Novo item adicionado:', newItem);
            setCartItems([...cartItems, newItem]);
        }
    };

    const updateQuantity = (produtoId, newQuantity) => {
        if (newQuantity <= 0) {
            setCartItems(cartItems.filter(item => item.produto_id !== produtoId));
        } else {
            setCartItems(cartItems.map(item =>
                item.produto_id === produtoId ? { ...item, quantidade: newQuantity } : item
            ));
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
    };

    const handleFinalizarVenda = async () => {
        if (!selectedClient) {
            alert('Selecione um cliente');
            return;
        }

        if (cartItems.length === 0) {
            alert('Adicione produtos ao carrinho');
            return;
        }

        const user = getUser();
        const userId = user?.ID || user?.id;

        if (!userId) {
            console.error('User object:', user);
            alert('Erro: Usuário não autenticado. Verifique o console.');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Estado do carrinho antes de enviar:', cartItems);

            const vendaData = {
                usuario_id: userId,
                cliente_id: selectedClient.ID,
                itens: cartItems.map(item => {
                    console.log('Mapeando item:', item);
                    return {
                        produto_id: item.produto_id,
                        quantidade: item.quantidade
                    };
                })
            };

            console.log('Enviando venda:', JSON.stringify(vendaData, null, 2));

            const result = await createSale(vendaData);

            if (result.success) {
                alert('Venda criada e nota fiscal gerada com sucesso!');
                setCartItems([]);
                setSelectedClient(null);
                setClientSearch('');
                await fetchSales();
            } else {
                alert(`Erro ao criar venda: ${result.error}`);
            }
        } catch (error) {
            alert('Erro ao processar venda');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
                                <p className="text-xs lg:text-sm font-semibold text-neutral-900">{currentUser?.nome || 'Usuário'}</p>
                                <p className="text-xs text-neutral-500">{currentUser?.perfil || 'N/A'}</p>
                            </div>
                            <div className="h-8 lg:h-10 w-8 lg:w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-xs lg:text-sm font-bold text-white">
                                    {currentUser?.nome?.substring(0, 2).toUpperCase() || 'U'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-3 lg:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Selecionar Cliente</h3>
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar clientes..."
                                        value={clientSearch}
                                        onChange={(e) => setClientSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                {selectedClient ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-green-900">{selectedClient.nome}</p>
                                                <p className="text-sm text-green-700">{selectedClient.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedClient(null);
                                                    setClientSearch('');
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-h-48 overflow-y-auto border border-neutral-200 rounded-lg">
                                        {filteredClients.length === 0 ? (
                                            <div className="p-4 text-center text-neutral-500">
                                                {clientSearch ? 'Nenhum cliente encontrado' : 'Digite para buscar clientes'}
                                            </div>
                                        ) : (
                                            filteredClients.slice(0, 8).map((client) => (
                                                <button
                                                    key={client.ID}
                                                    onClick={() => {
                                                        setSelectedClient(client);
                                                    }}
                                                    className="w-full text-left p-3 hover:bg-neutral-50 border-b border-neutral-200 last:border-b-0"
                                                >
                                                    <p className="font-medium">{client.nome}</p>
                                                    <p className="text-sm text-neutral-600">{client.email}</p>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 flex-1">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Produtos Disponíveis</h3>

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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                    {filteredProducts.map((product) => (
                                        <div key={product.ID} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                            <div className="flex flex-col h-full">
                                                <div className="flex-1 mb-4">
                                                    <h4 className="font-medium text-neutral-900 mb-2">
                                                        {product.nome}
                                                    </h4>
                                                    {product.fornecedores && product.fornecedores.length > 0 && (
                                                        <p className="text-xs text-neutral-500 mb-2">
                                                            Fornecedor: {product.fornecedores[0].nome}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-neutral-600 mb-2">
                                                        Estoque: {product.quantidade_estoque || 0} unidades
                                                    </p>
                                                    <p className="text-lg font-semibold text-neutral-900">
                                                        {formatCurrency(product.preco)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    disabled={!product.quantidade_estoque || product.quantidade_estoque === 0}
                                                    className="w-full px-4 py-2 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 transition-colors duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed"
                                                >
                                                    {!product.quantidade_estoque || product.quantidade_estoque === 0 ? 'Sem Estoque' : 'Adicionar'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 h-fit sticky top-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-6">Carrinho</h3>

                                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingCart className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                                            <p className="text-neutral-500">Carrinho vazio</p>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div key={item.produto_id} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                                <h4 className="font-medium text-neutral-900 mb-3">
                                                    {item.produto.nome}
                                                </h4>

                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.produto_id, item.quantidade - 1)}
                                                            className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-300 transition-colors duration-200"
                                                        >
                                                            <Minus className="h-4 w-4 text-neutral-600" />
                                                        </button>
                                                        <span className="font-medium text-neutral-900 min-w-[2rem] text-center">
                                                            {item.quantidade}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.produto_id, item.quantidade + 1)}
                                                            className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-300 transition-colors duration-200"
                                                        >
                                                            <Plus className="h-4 w-4 text-neutral-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-lg font-semibold text-neutral-900">
                                                    {formatCurrency(item.produto.preco * item.quantidade)}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {cartItems.length > 0 && (
                                    <>
                                        <div className="border-t border-neutral-200 pt-4 mb-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-semibold text-neutral-900">Total:</span>
                                                <span className="text-xl font-bold text-neutral-900">
                                                    {formatCurrency(calculateTotal())}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleFinalizarVenda}
                                            disabled={isLoading || !selectedClient}
                                            className="w-full py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Processando...' : 'Finalizar Venda'}
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => navigate('/sales/history')}
                                    className="w-full mt-4 py-3 bg-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors duration-200"
                                >
                                    Ver Todas as Vendas
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Vendas;
