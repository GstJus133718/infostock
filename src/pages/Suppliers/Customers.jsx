import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    UserCheck,
    Building2,
    Edit,
    Filter,
    Search,
    Plus,
    Bell,
    Menu,
    X,
    User
} from 'lucide-react';
import LogoInfostock from '../../assets/logo_infostock.png';
import { useClients, useSuppliers } from '../../hooks';
import { formatCPF, formatCNPJ, formatPhone, formatDate } from '../../utils/formatters';
import { getUser } from '../../utils/auth';

const InfoStock = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('clients');
    const [activeSection, setActiveSection] = useState('Fornecedores');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = getUser();

    // Hooks de API
    const { clients, loading: loadingClients, fetchClients } = useClients();
    const { suppliers, loading: loadingSuppliers, fetchSuppliers } = useSuppliers();

    // Carregar dados ao montar o componente
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchClients(),
                fetchSuppliers()
            ]);
            setIsLoading(false);
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filtrar clientes pela busca
    const filteredClients = clients.filter(client => {
        const searchLower = searchTerm.toLowerCase();
        return (
            client.nome?.toLowerCase().includes(searchLower) ||
            client.email?.toLowerCase().includes(searchLower) ||
            client.cpf?.includes(searchTerm) ||
            client.cnpj?.includes(searchTerm)
        );
    });

    // Filtrar fornecedores pela busca
    const filteredSuppliers = suppliers.filter(supplier => {
        const searchLower = searchTerm.toLowerCase();
        return (
            supplier.nome?.toLowerCase().includes(searchLower) ||
            supplier.email?.toLowerCase().includes(searchLower) ||
            supplier.cnpj?.includes(searchTerm)
        );
    });

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
            { id: 'clients', name: 'Clientes', icon: User },
            { id: 'suppliers', name: 'Fornecedores', icon: Building2 }
        ];

        return (
            <div className="mb-6">
                <div className="grid grid-cols-2 gap-0 bg-neutral-100 rounded-lg p-1">
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
                                <span>{tab.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Componente Tabela de Clientes
    const ClientsTable = () => {
        if (loadingClients || isLoading) {
            return (
                <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-8 flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                        <p className="text-neutral-600">Carregando clientes...</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-neutral-200 bg-neutral-50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
                        <h3 className="text-base lg:text-lg font-semibold text-neutral-900">Lista de Clientes</h3>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar clientes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-auto pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <button className="flex items-center justify-center px-3 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50">
                                <Filter className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Filtrar</span>
                            </button>
                            <button className="flex items-center justify-center px-3 lg:px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
                                <Plus className="h-4 w-4 mr-1 lg:mr-2" />
                                <span className="hidden sm:inline">Novo Cliente</span>
                                <span className="sm:hidden">Novo</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredClients.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500">
                            {searchTerm ? 'Nenhum cliente encontrado com esse termo de busca.' : 'Nenhum cliente cadastrado.'}
                        </div>
                    ) : (
                        <table className="w-full min-w-[1000px]">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">ID</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Nome</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">CPF/CNPJ</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Email</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Telefone</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Endereço</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Data de Nascimento</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Status</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {filteredClients.map((client) => {
                                    const cpfCnpj = client.cpf ? formatCPF(client.cpf) : (client.cnpj ? formatCNPJ(client.cnpj) : '-');
                                    const endereco = client.endereco ? `${client.endereco}, ${client.numero || ''} - ${client.cidade}/${client.estado}` : '-';

                                    return (
                                        <tr key={client.ID} className="hover:bg-neutral-50 transition-colors duration-150">
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                                #{client.ID.toString().padStart(3, '0')}
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 lg:w-10 h-8 lg:h-10 bg-neutral-200 rounded-lg mr-2 lg:mr-3 flex items-center justify-center">
                                                        <User className="h-4 lg:h-5 w-4 lg:w-5 text-neutral-500" />
                                                    </div>
                                                    <div className="text-xs lg:text-sm font-medium text-neutral-900">
                                                        {client.nome}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                                {cpfCnpj}
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                                {client.email || '-'}
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                                {client.telefone ? formatPhone(client.telefone) : '-'}
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900 max-w-[200px] truncate">
                                                {endereco}
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                                {client.data_nascimento ? formatDate(client.data_nascimento) : '-'}
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    client.status ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
                                                }`}>
                                                    {client.status? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                                                <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    };

    // Componente Tabela de Fornecedores
    const SuppliersTable = () => {
        if (loadingSuppliers || isLoading) {
            return (
                <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-8 flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                        <p className="text-neutral-600">Carregando fornecedores...</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-neutral-200 bg-neutral-50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
                        <h3 className="text-base lg:text-lg font-semibold text-neutral-900">Lista de Fornecedores</h3>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar fornecedores..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-auto pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <button className="flex items-center justify-center px-3 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50">
                                <Filter className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Filtrar</span>
                            </button>
                            <button className="flex items-center justify-center px-3 lg:px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
                                <Plus className="h-4 w-4 mr-1 lg:mr-2" />
                                <span className="hidden sm:inline">Novo Fornecedor</span>
                                <span className="sm:hidden">Novo</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredSuppliers.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500">
                            {searchTerm ? 'Nenhum fornecedor encontrado com esse termo de busca.' : 'Nenhum fornecedor cadastrado.'}
                        </div>
                    ) : (
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">ID</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Nome</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">CNPJ</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Email</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Telefone</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Status</th>
                                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-bold text-neutral-700 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {filteredSuppliers.map((supplier) => (
                                    <tr key={supplier.ID} className="hover:bg-neutral-50 transition-colors duration-150">
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-neutral-900">
                                            #{supplier.ID.toString().padStart(3, '0')}
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 lg:w-10 h-8 lg:h-10 bg-neutral-200 rounded-lg mr-2 lg:mr-3 flex items-center justify-center">
                                                    <Building2 className="h-4 lg:h-5 w-4 lg:w-5 text-neutral-500" />
                                                </div>
                                                <div className="text-xs lg:text-sm font-medium text-neutral-900">
                                                    {supplier.nome}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                            {supplier.cnpj ? formatCNPJ(supplier.cnpj) : '-'}
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                            {supplier.email || '-'}
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-neutral-900">
                                            {supplier.telefone ? formatPhone(supplier.telefone) : '-'}
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                supplier.status ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
                                            }`}>
                                                {supplier.status ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                                            <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                                <Edit className="h-3 w-3 mr-1" />
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
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
                    {/* Cards de Informação */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8">
                        <InfoCard
                            title="Total de Clientes"
                            value={isLoading ? '...' : clients.length.toString()}
                            icon={UserCheck}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                        <InfoCard
                            title="Total de Fornecedores"
                            value={isLoading ? '...' : suppliers.length.toString()}
                            icon={Building2}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                        <InfoCard
                            title="Fornecedores Ativos"
                            value={isLoading ? '...' : suppliers.filter(s => s.ativo).length.toString()}
                            icon={Users}
                            bgColor="bg-primary-100"
                            iconColor="text-primary-600"
                        />
                    </div>

                    {/* Barra de Abas e Conteúdo */}
                    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-neutral-200 p-3 lg:p-6">
                        <TabNavigation />

                        {/* Conteúdo da Aba Ativa */}
                        {activeTab === 'clients' && <ClientsTable />}
                        {activeTab === 'suppliers' && <SuppliersTable />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InfoStock;