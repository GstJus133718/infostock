import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    FileText,
    Menu,
    X,
    LogOut,
    Download,
    ArrowLeft
} from 'lucide-react';
import LogoInfostock from '../../assets/logo_infostock.png';
import { useSales } from '../../hooks/useSales';
import { useNotasFiscais } from '../../hooks/useNotasFiscais';
import { getUser, logout } from '../../utils/auth';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SalesHistory = () => {
    const navigate = useNavigate();
    const { sales, loading, fetchSales } = useSales();
    const { downloadXML, downloadPDF } = useNotasFiscais();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = getUser();

    useEffect(() => {
        fetchSales();
    }, []);

    const handleDownloadNFe = async (sale) => {
        console.log('Tentando baixar NF-e para venda:', sale);

        if (!sale.nota_fiscal) {
            alert('Esta venda não possui nota fiscal');
            return;
        }

        try {
            // Preparar dados da venda no formato correto para o gerador de PDF
            const saleData = {
                id: sale.ID || sale.id,
                data: sale.data_venda || sale.data,
                valor_total: sale.valor_total || 0,
                status: sale.status || 'DESCONHECIDO',
                usuario: typeof sale.usuario === 'string' ? sale.usuario : (sale.usuario?.nome || 'N/A'),
                cliente: typeof sale.cliente === 'string' ? sale.cliente : (sale.cliente?.nome || 'Cliente não informado'),
                itens: (sale.itens || []).map(item => ({
                    id: item.ID || item.id,
                    quantidade: item.quantidade || 0,
                    preco_unitario: item.preco_unitario || 0,
                    subtotal: item.subtotal || 0,
                    produto: typeof item.produto === 'string' ? item.produto : (item.produto?.nome || 'Produto'),
                    produto_sku: typeof item.produto === 'string' ? 'N/A' : (item.produto?.sku || 'N/A')
                })),
                nota_fiscal: {
                    id: sale.nota_fiscal.ID || sale.nota_fiscal.id,
                    numero: sale.nota_fiscal.numero || 'N/A',
                    serie: sale.nota_fiscal.serie || '001',
                    chave_acesso: sale.nota_fiscal.chave_acesso || 'N/A'
                }
            };

            console.log('Dados formatados para PDF:', saleData);

            // Validar se há itens
            if (!saleData.itens || saleData.itens.length === 0) {
                throw new Error('Esta venda não possui itens para gerar a nota fiscal');
            }

            // Gera o PDF da nota fiscal
            downloadPDF(saleData);
            alert('Nota fiscal baixada com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar NF-e:', error);
            alert(`Erro ao gerar nota fiscal em PDF: ${error.message || 'Erro desconhecido'}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMADA':
                return 'bg-green-100 text-green-800';
            case 'ABERTA':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELADA':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-neutral-100 text-neutral-800';
        }
    };

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* Sidebar */}
            <aside className={`bg-white w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-30`}>
                <div className="p-4 flex justify-between items-center border-b border-neutral-200">
                    <img src={LogoInfostock} alt="InfoStock Logo" className="h-12 w-auto" />
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-neutral-600 hover:text-neutral-900">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4">
                    <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 rounded-lg hover:bg-neutral-100 mb-2">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button onClick={() => navigate('/products')} className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 rounded-lg hover:bg-neutral-100 mb-2">
                        <Package size={20} />
                        <span>Produtos</span>
                    </button>
                    <button onClick={() => navigate('/suppliers')} className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 rounded-lg hover:bg-neutral-100 mb-2">
                        <Users size={20} />
                        <span>Clientes</span>
                    </button>
                    <button onClick={() => navigate('/sales')} className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg mb-2">
                        <ShoppingCart size={20} />
                        <span>Vendas</span>
                    </button>
                    <button onClick={() => navigate('/relatorios')} className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 rounded-lg hover:bg-neutral-100 mb-2">
                        <FileText size={20} />
                        <span>Relatórios</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-neutral-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.nome?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-900">{user?.nome || 'Usuário'}</p>
                            <p className="text-xs text-neutral-500">{user?.cargo || 'Cargo'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={18} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-neutral-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-neutral-600 hover:text-neutral-900">
                                <Menu size={24} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900">Histórico de Vendas</h1>
                                <p className="text-sm text-neutral-500">Visualize todas as vendas realizadas</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/sales')} className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors">
                            <ArrowLeft size={18} />
                            <span>Voltar para Vendas</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50 p-6">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                        {loading ? (
                            <div className="p-8 text-center">
                                <p className="text-neutral-500">Carregando vendas...</p>
                            </div>
                        ) : sales.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-neutral-500">Nenhuma venda encontrada</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-neutral-50 border-b border-neutral-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Valor Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">NF-e</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-neutral-200">
                                        {sales.map((sale) => (
                                            <tr key={sale.ID} className="hover:bg-neutral-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                                                    #{sale.ID}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                                                    {typeof sale.cliente === 'string' ? sale.cliente : sale.cliente?.nome || 'Cliente não informado'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                                    {formatDate(sale.data || sale.data_venda)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                                                    {formatCurrency(sale.valor_total)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                                                        {sale.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {sale.status === 'CONFIRMADA' && sale.nota_fiscal ? (
                                                        <button
                                                            onClick={() => handleDownloadNFe(sale)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                                        >
                                                            <Download size={16} />
                                                            <span>Baixar NF-e</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-neutral-400 text-xs">Indisponível</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"></div>
            )}
        </div>
    );
};

export default SalesHistory;
