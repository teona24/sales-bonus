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

  if (!data || !options) {
    throw new Error("Данные или опции не переданы");
  };
  const { calculateRevenue, calculateBonus } = options;

  // @TODO: Проверка наличия опций

  if (!calculateRevenue || !calculateBonus) {
    throw new Error("Не переданы функции для расчета выручки и бонусов");
  }

  if (!data.sellers || data.sellers.length === 0) {
    throw new Error("Нет данных о продавцах")
  }

  if (!data.products || data.products.length === 0) {
    throw new Error("Нет данных о продуктах")
  }

  if (!data.purchase_records || data.purchase_records.length === 0) {
    throw new Error("Нет данных о покупках")
  }

  // @TODO: Подготовка промежуточных данных для сбора статистики

  const sellerStats = {};
  data.sellers.forEach(seller => {
    sellerStats[seller.id] = {
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
    };
  });

  // @TODO: Индексация продавцов и товаров для быстрого доступа

  // @TODO: Расчет выручки и прибыли для каждого продавца

  // @TODO: Сортировка продавцов по прибыли

  // @TODO: Назначение премий на основе ранжирования

  // @TODO: Подготовка итоговой коллекции с нужными полями
}
