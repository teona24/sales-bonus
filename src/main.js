/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции
  const { discount, sale_price, quantity } = purchase;
  const decimalDiscount = discount / 100;
  const totalPrice = sale_price * quantity;
  const revenue = totalPrice * (1 - decimalDiscount);
  return revenue;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
  // @TODO: Расчет бонуса от позиции в рейтинге
  const { profit } = seller;

  if (index === 0) {
    return profit * 0.15;
  } else if (index === 1 || index === 2) {
    return profit * 0.1;
  } else if (index === total - 1) {
    return 0;
  } else {
    return profit * 0.05;
  }
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
  // @TODO: Проверка входных данных

  if (
    !data ||
    !options ||
    !Array.isArray(data.sellers) ||
    data.sellers.length === 0 ||
    !Array.isArray(data.products) ||
    data.products.length === 0 ||
    !Array.isArray(data.purchase_records) ||
    data.purchase_records.length === 0
  ) {
    throw new Error("Некорректные входные данные");
  }

  if (typeof options !== "object" || options === null) {
    throw new Error("Опции не являются объектом");
  }

  const { calculateRevenue, calculateBonus } = options;

  // @TODO: Проверка наличия опций

  if (!calculateRevenue || !calculateBonus) {
    throw new Error("Не переданы функции для расчета выручки и бонусов");
  }

  if (
    typeof calculateRevenue !== "function" ||
    typeof calculateBonus !== "function"
  ) {
    throw new Error("Переданы некорректные функции");
  }

  // @TODO: Подготовка промежуточных данных для сбора статистики

  const sellerStats = data.sellers.map((seller) => ({
    id: seller.id,
    name: `${seller.first_name} ${seller.last_name}`,
    revenue: 0,
    profit: 0,
    sales_count: 0,
    products_sold: {},
  }));

  // @TODO: Индексация продавцов и товаров для быстрого доступа

  const sellerIndex = Object.fromEntries(
    data.sellers.map((seller) => [seller.id, seller]),
  );

  Object.values(sellerIndex).forEach((seller) => {
    seller.revenue = 0;
    seller.profit = 0;
    seller.sales_count = 0;
    seller.products_sold = {};
  });
  const productIndex = Object.fromEntries(
    data.products.map((product) => [product.sku, product]),
  );

  // @TODO: Расчет выручки и прибыли для каждого продавца

  data.purchase_records.forEach((record) => {
    const seller = sellerIndex[record.seller_id];
    if (!seller) return;
    seller.sales_count += 1;
    seller.revenue += record.total_amount;

    record.items.forEach((item) => {
      const product = productIndex[item.sku];
      if (!product) return;

      const cost = product.purchase_price * item.quantity;
      const revenue = calculateRevenue(item, product);
      const profit = revenue - cost;

      seller.profit += profit;

      if (!seller.products_sold[item.sku]) {
        seller.products_sold[item.sku] = 0;
      }

      seller.products_sold[item.sku] += item.quantity;
    });
  });

  sellerStats.forEach((stat) => {
    const seller = sellerIndex[stat.id];
    if (seller) {
      stat.revenue = seller.revenue;
      stat.profit = seller.profit;
      stat.sales_count = seller.sales_count;
      stat.products_sold = seller.products_sold;
    }
  });
  // @TODO: Сортировка продавцов по прибыли

  const sortedSellers = sellerStats.toSorted((a, b) => b.profit - a.profit);

  // @TODO: Назначение премий на основе ранжирования

  const total = sortedSellers.length;
  sortedSellers.forEach((seller, index) => {
    seller.bonus = calculateBonus(index, total, seller);

    const topProducts = Object.entries(seller.products_sold)
      .map(([sku, quantity]) => ({ sku, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    seller.top_products = topProducts;
  });
  // @TODO: Подготовка итоговой коллекции с нужными полями

  return sortedSellers.map((seller) => ({
    seller_id: seller.id,
    name: seller.name,
    revenue: +seller.revenue.toFixed(2),
    profit: +seller.profit.toFixed(2),
    sales_count: seller.sales_count,
    top_products: seller.top_products,
    bonus: +seller.bonus.toFixed(2)
  }));
}
