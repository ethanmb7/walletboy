import { formatDate } from "../../utils";

import type { ResponseTransaction } from ".";

export type TransactionGroup = {
  date: string;
  data: ResponseTransaction[];
};

/**
 * Group the argued list of transactions by date.
 * @export
 * @param {ResponseTransaction[]} transactions
 * @returns {TransactionGroup[]}
 */
export function getGroupedTransactions(
  transactions: ResponseTransaction[]
): TransactionGroup[] {
  const groupedTxs: TransactionGroup[] = [];
  const filteredTxs = transactions.filter((t) => t.timestamp);

  for (let i = 0; i < filteredTxs.length; i++) {
    const date = formatDate(new Date(transactions[i].timestamp!));

    if (
      groupedTxs.length === 0 ||
      groupedTxs[groupedTxs.length - 1].date !== date
    ) {
      groupedTxs.push({
        date,
        data: [filteredTxs[i]],
      });
    } else {
      groupedTxs[groupedTxs.length - 1].data.push(filteredTxs[i]);
    }
  }
  return groupedTxs;
}