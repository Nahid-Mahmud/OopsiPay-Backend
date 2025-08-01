import { TransactionType } from "../modules/transactions/transaction.interface";

const cashOutFeePercentage = 1.85 / 100; // 1.8%
const cashInFeePercentage = 0.0; // no fee for cash in
const sendMoneyFee = 5; // flat fee for send money
const adminChargeForSendMoney = 5;
const adminChargeForCashOut = 50 / 100;

export const calculateTransactionFee = (
  amount: number,
  transactionType: string
): {
  transactionFee: number;
  netAmount: number;
  adminCredit: number;
  agentCredit: number;
} => {
  switch (transactionType) {
    case TransactionType.CASH_OUT: {
      const totalTransactionFee = amount * cashOutFeePercentage;
      const netAmount = amount - totalTransactionFee;
      const adminCredit = totalTransactionFee * adminChargeForCashOut;
      const agentCredit = totalTransactionFee - adminCredit;
      return {
        transactionFee: parseFloat(totalTransactionFee.toFixed(2)),
        netAmount: parseFloat(netAmount.toFixed(2)),
        adminCredit: parseFloat(adminCredit.toFixed(2)),
        agentCredit: parseFloat(agentCredit.toFixed(2)),
      };
    }

    case TransactionType.CASH_IN: {
      return {
        transactionFee: parseFloat(cashInFeePercentage.toFixed(2)),
        netAmount: parseFloat(amount.toFixed(2)),
        adminCredit: 0.0,
        agentCredit: 0.0,
      };
    }
    case TransactionType.SEND_MONEY:
      return {
        transactionFee: parseFloat(sendMoneyFee.toFixed(2)),
        netAmount: parseFloat((amount - sendMoneyFee).toFixed(2)),
        adminCredit: parseFloat(adminChargeForSendMoney.toFixed(2)),
        agentCredit: sendMoneyFee,
      };
    case TransactionType.ADMIN_CREDIT:
      return {
        transactionFee: 0.0,
        netAmount: parseFloat(amount.toFixed(2)),
        adminCredit: 0.0,
        agentCredit: 0.0,
      };
    default:
      throw new Error("Invalid transaction type");
  }
};
