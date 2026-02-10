import clsx from 'clsx';

const Price = ({
  amount,
  className,
  currencyCode = '',
  currencyCodeClassName
}: {
  amount: string;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => (
  <p suppressHydrationWarning={true} className={className}>
    {`${new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).format(Number(amount))}`}
    <span className={clsx('text-xs ml-1 inline', currencyCodeClassName)}>
      {/* {`${currencyCode}`} */}
    </span>
  </p>
);

export default Price;