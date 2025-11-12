import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    DollarSign,
    Box,
    Tag,
    Edit,
    Eye,
    Trash2,
    Plus,
    Filter,
    Search,
    Download,
    Bell,
    Menu,
    X,
    Save,
    ArrowUp,
    ArrowDown,
    Calendar
} from 'lucide-react';
import LogoInfostock from '../../assets/logo_infostock.png';

const InfoStockDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('visualization');
    const [activeSection, setActiveSection] = useState('Produtos');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Estados para o formulário de entrada
    const [entryForm, setEntryForm] = useState({
        produto: '',
        quantidade: '',
        categoria: '',
        fornecedor: '',
        valor: ''
    });

    // Dados dos produtos
    const products = [
        {
            id: 1,
            name: 'Placa de Vídeo RTX 4070',
            category: 'Eletrônicos',
            supplier: 'Gigabyte',
            quantity: 15,
            unitPrice: 5000.00,
            totalPrice: 75000.00,
            status: 'Ativo'
        },
        {
            id: 2,
            name: 'Memória RAM 16GB',
            category: 'Eletrônicos',
            supplier: 'Kingston',
            quantity: 25,
            unitPrice: 300.00,
            totalPrice: 7500.00,
            status: 'Ativo'
        }
    ];

    // Dados das movimentações
    const movements = [
        {
            id: 1,
            type: 'Entrada',
            productId: 1,
            productName: 'Placa de Vídeo RTX 4070',
            quantity: 10,
            date: '2024-01-15',
            supplierClient: 'Gigabyte',
            totalValue: 50000.00,
            responsible: 'João Silva'
        },
        {
            id: 2,
            type: 'Saída',
            productId: 1,
            productName: 'Placa de Vídeo RTX 4070',
            quantity: 2,
            date: '2024-01-14',
            supplierClient: 'Cliente ABC',
            totalValue: 10000.00,
            responsible: 'Maria Santos'
        },
        {
            id: 3,
            type: 'Entrada',
            productId: 2,
            productName: 'Memória RAM 16GB',
            quantity: 50,
            date: '2024-01-13',
            supplierClient: 'Kingston',
            totalValue: 15000.00,
            responsible: 'Pedro Costa'
        },
        {
            id: 4,
            type: 'Saída',
            productId: 2,
            productName: 'Memória RAM 16GB',
            quantity: 5,
            date: '2024-01-12',
            supplierClient: 'Cliente XYZ',
            totalValue: 1500.00,
            responsible: 'Ana Lima'
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

    // Componente Card de Informação
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

    // Componente Barra de Abas
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
                                className={`flex items-center justify-center px-3 py-3 rounded-md font-medium text-sm transition-all duration-200 ${activeTab === tab.id
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

    // Componente Tabela de Visualização
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
                                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <button className="flex items-center justify-center px-3 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50">
                            <Filter className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Filtrar</span>
                        </button>
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
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-neutral-50 transition-colors duration-150">
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                    #{product.id.toString().padStart(3, '0')}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-8 lg:w-10 h-8 lg:h-10 bg-neutral-200 rounded-lg mr-2 lg:mr-3 flex items-center justify-center">
                                            <Package className="h-4 lg:h-5 w-4 lg:w-5 text-neutral-500" />
                                        </div>
                                        <div className="text-xs lg:text-sm font-medium text-neutral-900">
                                            {product.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {product.category}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {product.supplier}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {product.quantity}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    R$ {product.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                    R$ {product.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-700">
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                                    <button className="inline-flex items-center px-6 py-2 border border-transparent text-xs font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Componente Formulário de Entrada
    const StockEntryForm = () => {
        const handleInputChange = (field, value) => {
            setEntryForm(prev => ({
                ...prev,
                [field]: value
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Dados do formulário:', entryForm);
            // Aqui você implementaria a lógica para salvar
            alert('Entrada de estoque salva com sucesso!');
            setEntryForm({
                produto: '',
                quantidade: '',
                categoria: '',
                fornecedor: '',
                valor: ''
            });
        };

        return (
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Nova Entrada de Estoque</h3>
                    <p className="text-sm text-neutral-600">Preencha os dados para adicionar produtos ao estoque</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                    {/* Campo Produto - Largura Total */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Produto *
                        </label>
                        <input
                            type="text"
                            value={entryForm.produto}
                            onChange={(e) => handleInputChange('produto', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nome do produto"
                            required
                        />
                    </div>

                    {/* Demais campos em grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Quantidade *
                            </label>
                            <input
                                type="number"
                                value={entryForm.quantidade}
                                onChange={(e) => handleInputChange('quantidade', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Quantidade"
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Categoria *
                            </label>
                            <select
                                value={entryForm.categoria}
                                onChange={(e) => handleInputChange('categoria', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                <option value="Eletrônicos">Eletrônicos</option>
                                <option value="Periféricos">Periféricos</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Acessórios">Acessórios</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Fornecedor *
                            </label>
                            <input
                                type="text"
                                value={entryForm.fornecedor}
                                onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Nome do fornecedor"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Valor Unitário *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">R\$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={entryForm.valor}
                                    onChange={(e) => handleInputChange('valor', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="0,00"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4 border-t border-neutral-200">
                        <button
                            type="submit"
                            className="w-64 flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                        >
                            Salvar Entrada
                        </button>
                    </div>
                </form>
            </div>
        );
    };
    // Componente Tabela de Movimentações
    const MovementsTable = () => (
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-neutral-200 bg-neutral-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
                    <h3 className="text-base lg:text-lg font-semibold text-neutral-900">Movimentações do Estoque</h3>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Buscar movimentações..."
                                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <button className="flex items-center justify-center px-3 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50">
                            <Filter className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Filtrar</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Tipo</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">ID</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Produto</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Quantidade</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Data</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Fornecedor/Cliente</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Valor Total</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">Responsável</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {movements.map((movement) => (
                            <tr key={movement.id} className="hover:bg-neutral-50 transition-colors duration-150">
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${movement.type === 'Entrada'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {movement.type}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                    #{movement.id.toString().padStart(3, '0')}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {movement.productName}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {movement.quantity}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {new Date(movement.date).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {movement.supplierClient}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                    R$ {movement.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {movement.responsible}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

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
                    {/* Cards de Informação */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8">
                        <InfoCard
                            title="Valor Total em Estoque"
                            value="R$ 1.000.000"
                            icon={DollarSign}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                        <InfoCard
                            title="Total Produtos em Estoque"
                            value="150"
                            icon={Box}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                        <InfoCard
                            title="Categorias"
                            value="18"
                            icon={Tag}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                    </div>

                    {/* Barra de Abas e Conteúdo */}
                    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-3 lg:p-6">
                        <TabNavigation />

                        {/* Conteúdo da Aba Ativa */}
                        {activeTab === 'visualization' && <VisualizationTable />}
                        {activeTab === 'stock-entry' && <StockEntryForm />}
                        {activeTab === 'movements' && <MovementsTable />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InfoStockDashboard;