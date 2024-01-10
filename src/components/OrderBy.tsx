import classNames from 'classnames';

interface OrderByProps {
  value: 'relevance' | 'latest';
  orderBy: 'relevance' | 'latest';
  setOrderBy: (orderBy: 'relevance' | 'latest') => void;
}

const OrderBy = ({ value, orderBy, setOrderBy }: OrderByProps) => (
  <div
    className={classNames(
      'rounded px-4 py-2 border border-slate-600 cursor-pointer',
      orderBy === value
        ? 'bg-slate-600 text-stone-100'
        : 'bg-slate-800 text-stone-400 hover:bg-slate-700 hover:text-stone-300'
    )}
    onClick={() => setOrderBy(value)}
  >
    Order by {value}
  </div>
);

export default OrderBy;
