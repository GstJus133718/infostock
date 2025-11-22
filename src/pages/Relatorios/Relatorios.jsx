import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    DollarSign,
    Box,
    FileText,
    Search,
    Filter,
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    Bell,
    Menu,
    X
} from 'lucide-react';
import LogoInfostock from '../../assets/logo_infostock.png';

const Relatorios = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Relatórios');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Estados dos filtros
    const [filters, setFilters] = useState({
        produto: '',
        responsavel: '',
        cliente: '',
        dataInicial: '',
        dataFinal: ''
    });

    // Dados dos relatórios
    const salesData = [
        {
            id: '01',
            produto: 'Memória RAM 16GB',
            quantidade: 25,
            data: '15/10/25',
            fornecedorCliente: 'Cliente 1',
            valorTotal: 7500.00,
            responsavel: 'Gustavo Juscinski'
        },
        {
            id: '02',
            produto: 'Placa de Vídeo RTX 4070',
            quantidade: 2,
            data: '14/10/25',
            fornecedorCliente: 'Cliente ABC',
            valorTotal: 10000.00,
            responsavel: 'Maria Santos'
        },
        {
            id: '03',
            produto: 'SSD Kingston 480GB',
            quantidade: 10,
            data: '13/10/25',
            fornecedorCliente: 'Cliente XYZ',
            valorTotal: 3000.00,
            responsavel: 'João Silva'
        },
        {
            id: '04',
            produto: 'Monitor LG 24"',
            quantidade: 5,
            data: '12/10/25',
            fornecedorCliente: 'Cliente 2',
            valorTotal: 2500.00,
            responsavel: 'Ana Lima'
        },
        {
            id: '05',
            produto: 'Teclado Mecânico',
            quantidade: 15,
            data: '11/10/25',
            fornecedorCliente: 'Cliente DEF',
            valorTotal: 4500.00,
            responsavel: 'Pedro Costa'
        }
    ];

    // Componente Sidebar Responsivo
    const Sidebar = ({ active, onNavigate }) => {
        const navItems = [
            { name: 'Dashboard', icon: LayoutDashboard, current: active === 'Dashboard', path: '/home' },
            { name: 'Produtos', icon: Package, current: active === 'Produtos', path: '/products' },
            { name: 'Parceiros', icon: Users, current: active === 'Parceiros', path: '/suppliers' },
            { name: 'Vendas', icon: ShoppingCart, current: active === 'Vendas', path: '/sales' },
            { name: 'Relatórios', icon: FileText, current: active === 'Relatórios', path: '/reports' },
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

                <div className={`fixed left-0 top-0 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:h-full w-64 border-r border-neutral-200 flex flex-col`}>
                    
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
    const InfoCard = ({ title, value, comparison, trend, icon: Icon, bgColor, iconColor, valueColor, comparisonColor }) => (
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm p-4 lg:p-6 border border-neutral-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl ${bgColor} shadow-sm`}>
                    <Icon className={`h-5 lg:h-6 w-5 lg:w-6 ${iconColor}`} />
                </div>
                {trend && (
                    <div className={`flex items-center p-2 rounded-lg ${trend === 'up' ? 'bg-success-50 text-success-500' : 'bg-danger-50 text-danger-500'}`}>
                        {trend === 'up' ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                    </div>
                )}
            </div>
            <p className="text-xs lg:text-sm font-semibold text-neutral-600 mb-1 lg:mb-2">{title}</p>
            <p className={`text-xl lg:text-3xl font-bold ${valueColor} mb-2 lg:mb-3`}>{value}</p>
            {comparison && (
                <p className={`text-xs lg:text-sm font-medium ${comparisonColor}`}>
                    {comparison}
                </p>
            )}
        </div>
    );

    // Componente Filtros
    const FiltersSection = () => (
        <div className="bg-neutral-50 rounded-lg p-4 lg:p-6 mb-6">
            <h4 className="text-base lg:text-lg font-semibold text-neutral-900 mb-4">Filtros</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Nome ou ID do Produto
                    </label>
                    <input
                        type="text"
                        value={filters.produto}
                        onChange={(e) => setFilters({...filters, produto: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder="Buscar produto..."
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Responsável
                    </label>
                    <input
                        type="text"
                        value={filters.responsavel}
                        onChange={(e) => setFilters({...filters, responsavel: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder="Nome do responsável..."
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Cliente
                    </label>
                    <input
                        type="text"
                        value={filters.cliente}
                        onChange={(e) => setFilters({...filters, cliente: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder="Nome do cliente..."
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Data Inicial
                    </label>
                    <input
                        type="date"
                        value={filters.dataInicial}
                        onChange={(e) => setFilters({...filters, dataInicial: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Data Final
                    </label>
                    <input
                        type="date"
                        value={filters.dataFinal}
                        onChange={(e) => setFilters({...filters, dataFinal: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button className="flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 text-sm font-medium">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-sm font-medium">
                    <Filter className="h-4 w-4 mr-2" />
                    Limpar Filtros
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors duration-200 text-sm font-medium">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                </button>
            </div>
        </div>
    );

    // Componente Tabela de Relatórios
    const ReportsTable = () => (
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-neutral-200 bg-neutral-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
                    <h3 className="text-base lg:text-lg font-semibold text-neutral-900">Relatório de Vendas</h3>
                    <div className="flex items-center text-sm text-neutral-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {salesData.length} registros encontrados
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">ID</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Produto</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Quantidade</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Data</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Fornecedor/Cliente</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Valor Total</th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Responsável</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {salesData.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50 transition-colors duration-150">
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                    {item.id}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-8 lg:w-10 h-8 lg:h-10 bg-neutral-200 rounded-lg mr-2 lg:mr-3 flex items-center justify-center">
                                            <Package className="h-4 lg:h-5 w-4 lg:w-5 text-neutral-500" />
                                        </div>
                                        <div className="text-xs lg:text-sm font-medium text-neutral-900">
                                            {item.produto}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {item.quantidade}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {item.data}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {item.fornecedorCliente}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                    R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                    {item.responsavel}
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
                'Vendas': '/sales',
                'Relatórios': '/reports'
            };
            
            if (routes[section]) {
                navigate(routes[section]);
            }
        }
    };

    return (
        <div className="flex h-screen bg-neutral-100">
            <Sidebar active={activeSection} onNavigate={handleNavigation} />

            <div className="flex-1 flex flex-col min-h-0">
                <header className="bg-white shadow-sm border-b border-neutral-200 h-14 lg:h-16 flex items-center justify-between lg:justify-end px-4 lg:px-6 flex-shrink-0">
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
                            title="Total Vendas do Mês"
                            value="R$ 100.000"
                            comparison="+10,5% em relação ao mês anterior"
                            trend="up"
                            icon={DollarSign}
                            bgColor="bg-success-100"
                            iconColor="text-success-600"
                            valueColor="text-primary-600"
                            comparisonColor="text-success-600"
                        />
                        <InfoCard
                            title="Quantidade de Produtos Vendidos"
                            value="150"
                            comparison="-0,5% em relação ao mês anterior"
                            trend="down"
                            icon={Box}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                            valueColor="text-primary-600"
                            comparisonColor="text-danger-600"
                        />
                        <InfoCard
                            title="Fornecedores Ativos"
                            value="98"
                            icon={Users}
                            bgColor="bg-secondary-100"
                            iconColor="text-secondary-600"
                            valueColor="text-primary-600"
                        />
                    </div>

                    {/* Card Principal com Filtros e Tabela */}
                    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 flex items-center">
                                <FileText className="h-6 w-6 text-primary-500 mr-3" />
                                Relatórios de Vendas
                            </h2>
                        </div>

                        <FiltersSection />
                        <ReportsTable />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Relatorios;