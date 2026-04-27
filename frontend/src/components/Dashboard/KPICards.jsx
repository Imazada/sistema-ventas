import React from 'react';
import { Package, DollarSign, AlertTriangle, Trophy } from 'lucide-react';

const KPICards = ({ kpis }) => {
  const cards = [
    {
      titulo: 'Total Productos',
      valor: kpis?.totalProductos || 0,
      icono: Package,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      titulo: 'Valor Inventario',
      valor: `$${kpis?.valorInventario || 0}`,
      icono: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      titulo: 'Productos Bajo Stock',
      valor: kpis?.bajoStock || 0,
      icono: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      titulo: 'Producto Más Valioso',
      valor: kpis?.productoMasValioso?.nombre || 'N/A',
      icono: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icono = card.icono;
        return (
          <div key={index} className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-title">{card.titulo}</p>
                <p className="metric-value">{card.valor}</p>
              </div>
              <div className={`${card.bgColor} p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110`}>
                <Icono className={card.color} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
