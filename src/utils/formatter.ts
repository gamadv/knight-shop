export function priceFormatter(value: number) {
    const priceFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)

    return priceFormatter
}
