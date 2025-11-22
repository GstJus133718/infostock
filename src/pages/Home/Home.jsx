import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    DollarSign,
    Box,
    AlertTriangle,
    BarChart,
    Shield,
    FileText,
    TrendingUp,
    TrendingDown,
    Bell,
    Menu,
    X,
    RefreshCw,
    LogOut
} from 'lucide-react';
import LogoInfostock from '../../assets/logo_infostock.png';
import { useDashboard } from '../../hooks/useDashboard';
import { getUser, isAuthenticated, logout } from '../../utils/auth';
import { formatCurrency } from '../../utils/formatters';

// Gráfico de Vendas Mensais (Barras)
const MonthlySalesChart = ({ data, loading }) => {
    if (loading || !data || data.length === 0) {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-500"></div>
            </div>
        );
    }

    const maxVal = Math.max(...data.map(item => item.total));
    const paddedMax = maxVal * 1.2;

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center">
                    <BarChart className="h-5 w-5 text-secondary-500 mr-2" />
                    Vendas Mensais
                </h3>
                <span className="text-sm text-neutral-500">Últimos {data.length} meses</span>
            </div>

            <div className="flex flex-col flex-1">
                <div className="flex flex-1">
                    <div className="w-16 flex flex-col justify-between text-xs text-neutral-500 pr-3">
                        <div>{(paddedMax).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                        <div>{(paddedMax * 0.75).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                        <div>{(paddedMax * 0.5).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                        <div>{(paddedMax * 0.25).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                        <div>0</div>
                    </div>

                    <div className="flex-grow flex items-end border-b-2 border-l-2 border-neutral-300 pl-3">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-end h-full flex-1 px-1"
                            >
                                <div
                                    className="w-full rounded-t-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                                    style={{
                                        height: `${(item.total / paddedMax) * 100}%`,
                                        background: 'linear-gradient(to top, #ea7c0d, #F88624)',
                                    }}
                                >
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                        {formatCurrency(item.total)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex mt-3 ml-16 pl-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex-1 text-center text-xs text-neutral-500 font-medium">
                            {item.mes}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Gráfico de Produtos Mais Vendidos (Pizza)
const TopSellingProductsChart = ({ data, loading }) => {
    if (loading || !data || data.length === 0) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-500"></div>
            </div>
        );
    }

    const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#10b981'];

    const createPieSlices = () => {
        let cumulativePercentage = 0;
        const radius = 80;
        const centerX = 200;
        const centerY = 200;

        return data.map((item, index) => {
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + item.percentual) / 100) * 360;
            const midAngle = (startAngle + endAngle) / 2;

            const startAngleRad = (startAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);
            const midAngleRad = (midAngle - 90) * (Math.PI / 180);

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = item.percentual > 50 ? 1 : 0;

            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');

            const lineStartX = centerX + (radius + 10) * Math.cos(midAngleRad);
            const lineStartY = centerY + (radius + 10) * Math.sin(midAngleRad);
            const lineEndX = centerX + (radius + 60) * Math.cos(midAngleRad);
            const lineEndY = centerY + (radius + 60) * Math.sin(midAngleRad);

            cumulativePercentage += item.percentual;

            return {
                ...item,
                pathData,
                color: colors[index % colors.length],
                lineStartX,
                lineStartY,
                lineEndX,
                lineEndY,
            };
        });
    };

    const pieSlices = createPieSlices();

    return (
        <div className="bg-white p-8 flex items-center justify-center">
            <div className="relative">
                <svg width="400" height="400" viewBox="0 0 400 400">
                    {pieSlices.map((slice, index) => (
                        <path
                            key={index}
                            d={slice.pathData}
                            fill={slice.color}
                            stroke="white"
                            strokeWidth="2"
                            className="hover:opacity-80 transition-opacity duration-200"
                        />
                    ))}

                    {pieSlices.map((slice, index) => (
                        <g key={`line-${index}`}>
                            <line
                                x1={slice.lineStartX}
                                y1={slice.lineStartY}
                                x2={slice.lineEndX}
                                y2={slice.lineEndY}
                                stroke="#666"
                                strokeWidth="1.5"
                            />
                            <circle cx={slice.lineEndX} cy={slice.lineEndY} r="2" fill="#666" />
                        </g>
                    ))}

                    {pieSlices.map((slice, index) => {
                        const isRight = slice.lineEndX > 200;
                        const textAnchor = isRight ? 'start' : 'end';
                        const textX = isRight ? slice.lineEndX + 8 : slice.lineEndX - 8;

                        return (
                            <g key={`label-${index}`}>
                                <text
                                    x={textX}
                                    y={slice.lineEndY - 5}
                                    textAnchor={textAnchor}
                                    className="text-sm font-semibold"
                                    fill="#374151"
                                >
                                    {slice.produto_nome.length > 20
                                        ? slice.produto_nome.substring(0, 20) + '...'
                                        : slice.produto_nome}
                                </text>
                                <text
                                    x={textX}
                                    y={slice.lineEndY + 12}
                                    textAnchor={textAnchor}
                                    className="text-xs"
                                    fill="#6b7280"
                                >
                                    {slice.quantidade_total} ({slice.percentual.toFixed(1)}%)
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const { stats, salesByMonth, topProducts, lowStock, loading, fetchAllDashboardData } = useDashboard();
    const [activeSection, setActiveSection] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const user = getUser();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        loadDashboard();
    }, [navigate]);

    const loadDashboard = async () => {
        await fetchAllDashboardData();
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadDashboard();
        setRefreshing(false);
    };

    const Sidebar = ({ active, onNavigate }) => {
        const navItems = [
            { name: 'Dashboard', icon: LayoutDashboard, current: active === 'Dashboard', path: '/home' },
            { name: 'Produtos', icon: Package, current: active === 'Produtos', path: '/products' },
            { name: 'Parceiros', icon: Users, current: active === 'Parceiros', path: '/suppliers' },
            { name: 'Vendas', icon: ShoppingCart, current: active === 'Vendas', path: '/sales' },
        ];

        const handleNavigation = (item) => {
            onNavigate && onNavigate(item.name, item.path);
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

    const StatCard = ({ title, value, comparison, trend, icon: Icon, bgColor, iconColor, valueColor, comparisonColor }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${bgColor} shadow-sm`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                {trend && (
                    <div className={`flex items-center p-2 rounded-lg ${trend === 'up' ? 'bg-success-50 text-success-500' : 'bg-danger-50 text-danger-500'}`}>
                        {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                )}
            </div>
            <p className="text-sm font-semibold text-neutral-600 mb-2">{title}</p>
            <p className={`text-3xl font-bold ${valueColor} mb-3`}>{value}</p>
            {comparison && (
                <p className={`text-sm font-medium ${comparisonColor || (trend === 'up' ? 'text-success-600' : 'text-danger-600')}`}>
                    {comparison}
                </p>
            )}
        </div>
    );

    const LowStockItem = ({ produto, quantidade_atual }) => {
        const highlight = quantidade_atual < 5;

        return (
            <div className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                highlight
                    ? 'bg-danger-50 border-danger-200 hover:bg-danger-100'
                    : 'bg-warning-50 border-warning-200 hover:bg-warning-100'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="font-semibold text-neutral-900 mb-1">{produto.nome}</p>
                        <p className="text-xs text-neutral-500 mb-2">SKU: {produto.sku}</p>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-neutral-600">
                                Estoque: <span className={`font-bold ${highlight ? 'text-danger-600' : 'text-warning-600'}`}>{quantidade_atual}</span>
                            </span>
                            <span className="text-sm text-neutral-600">
                                Preço: <span className="font-medium">{formatCurrency(produto.preco)}</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <AlertTriangle className={`h-5 w-5 ${highlight ? 'text-danger-500' : 'text-warning-500'}`} />
                    </div>
                </div>
            </div>
        );
    };

    const QuickActionButton = ({ title, icon: Icon, highlight, bgColor, textColor, hoverColor, onClick }) => (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-6 h-28 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                highlight
                    ? `${bgColor} ${textColor} ${hoverColor}`
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
        >
            <Icon className="h-7 w-7 mb-2" />
            <span className="text-sm font-semibold text-center leading-tight">{title}</span>
        </button>
    );

    const handleNavigation = (section, path) => {
        setActiveSection(section);
        if (path) {
            navigate(path);
        }
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'Nova Venda':
                navigate('/sales');
                break;
            case 'Novo Produto':
                navigate('/products');
                break;
            case 'Fornecedores':
                navigate('/suppliers');
                break;
            case 'Relatórios':
                navigate('/relatorios');
                break;
            default:
                console.log(`Ação rápida: ${action}`);
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
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 lg:h-5 w-4 lg:w-5 ${refreshing ? 'animate-spin' : ''}`} />
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

                <main className="flex-1 p-3 lg:p-6 overflow-y-auto">
                    {loading && !stats ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                                <p className="text-neutral-600">Carregando dashboard...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-full mx-auto space-y-6 lg:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6">
                                <StatCard
                                    title="Total Vendas do Mês"
                                    value={stats ? formatCurrency(stats.vendas_mes_atual.total) : 'R$ 0,00'}
                                    comparison={stats ? `${stats.vendas_mes_atual.variacao >= 0 ? '+' : ''}${stats.vendas_mes_atual.variacao.toFixed(1)}% em relação ao mês anterior` : ''}
                                    trend={stats?.vendas_mes_atual.variacao >= 0 ? 'up' : 'down'}
                                    icon={DollarSign}
                                    bgColor="bg-success-100"
                                    iconColor="text-success-600"
                                    valueColor="text-primary-600"
                                />

                                <StatCard
                                    title="Produtos Vendidos"
                                    value={stats?.produtos_vendidos.total.toLocaleString() || '0'}
                                    comparison={stats ? `${stats.produtos_vendidos.variacao >= 0 ? '+' : ''}${stats.produtos_vendidos.variacao.toFixed(1)}% em relação ao mês anterior` : ''}
                                    trend={stats?.produtos_vendidos.variacao >= 0 ? 'up' : 'down'}
                                    icon={Box}
                                    bgColor="bg-primary-100"
                                    iconColor="text-primary-600"
                                    valueColor="text-primary-600"
                                />

                                <StatCard
                                    title="Fornecedores Ativos"
                                    value={stats?.fornecedores_ativos.total.toLocaleString() || '0'}
                                    comparison={stats ? `+${stats.fornecedores_ativos.novos_este_mes} novos fornecedores` : ''}
                                    trend="up"
                                    icon={Users}
                                    bgColor="bg-secondary-100"
                                    iconColor="text-secondary-600"
                                    valueColor="text-primary-600"
                                    comparisonColor="text-success-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-200">
                                    <MonthlySalesChart data={salesByMonth} loading={loading} />
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-200">
                                    <TopSellingProductsChart data={topProducts} loading={loading} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-6">
                                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                                        <h3 className="text-base lg:text-lg font-bold text-neutral-900 flex items-center">
                                            <AlertTriangle className="h-4 lg:h-5 w-4 lg:w-5 text-warning-500 mr-2" />
                                            <span className="hidden sm:inline">Produtos com Estoque Baixo</span>
                                            <span className="sm:hidden">Estoque Baixo</span>
                                            <span className="ml-2 lg:ml-3 bg-danger-100 text-danger-600 text-xs font-semibold px-2 lg:px-3 py-1 rounded-full">
                                                {stats?.estoque_baixo || 0}
                                            </span>
                                        </h3>
                                        <button className="text-primary-500 hover:text-primary-600 text-xs lg:text-sm font-semibold">
                                            Ver todos
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {lowStock && lowStock.length > 0 ? (
                                            lowStock.map((item, index) => (
                                                <LowStockItem key={index} {...item} />
                                            ))
                                        ) : (
                                            <p className="text-center text-neutral-500 py-8">
                                                {loading ? 'Carregando...' : 'Nenhum produto com estoque baixo'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-neutral-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
                                    <h3 className="text-base lg:text-lg font-bold text-neutral-900 mb-4 lg:mb-6 flex items-center">
                                        <Shield className="h-4 lg:h-5 w-4 lg:w-5 text-primary-500 mr-2" />
                                        Ações Rápidas
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                                        <QuickActionButton
                                            title="Nova Venda"
                                            icon={ShoppingCart}
                                            highlight={true}
                                            bgColor="bg-primary-50"
                                            textColor="text-primary-700"
                                            hoverColor="hover:bg-primary-100"
                                            onClick={() => handleQuickAction('Nova Venda')}
                                        />
                                        <QuickActionButton
                                            title="Novo Produto"
                                            icon={Package}
                                            highlight={false}
                                            onClick={() => handleQuickAction('Novo Produto')}
                                        />
                                        <QuickActionButton
                                            title="Fornecedores"
                                            icon={Users}
                                            highlight={false}
                                            onClick={() => handleQuickAction('Fornecedores')}
                                        />
                                        <QuickActionButton
                                            title="Relatórios"
                                            icon={FileText}
                                            highlight={false}
                                            onClick={() => handleQuickAction('Relatórios')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Home;
